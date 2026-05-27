"""
Gym Management System — MCP Server (FastMCP version)
Exposes backend AI tools via MCP protocol using Anthropic's FastMCP.
JWT is propagated from MCP client → server → backend for RBAC enforcement.

Run:
    python main.py
"""

import os
import json
from dotenv import load_dotenv
import httpx
from mcp.server.fastmcp import FastMCP

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5294")

# Initialize FastMCP server
mcp = FastMCP("gym-management-mcp")

# ── Backend HTTP helper ───────────────────────────────────────────────────────

async def call_backend(method: str, path: str, auth_token: str, payload: dict | None = None) -> str:
    """Forward request to ASP.NET backend with JWT propagation."""
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        if method == "GET":
            resp = await client.get(f"{BACKEND_URL}{path}", headers=headers)
        else:
            resp = await client.post(f"{BACKEND_URL}{path}", headers=headers, json=payload)

    try:
        data = resp.json()
        return json.dumps(data, ensure_ascii=False, indent=2)
    except Exception:
        return resp.text


# ── FastMCP Tool Definitions ──────────────────────────────────────────────────

@mcp.tool()
async def ai_chat(message: str, auth_token: str) -> str:
    """
    Gửi tin nhắn đến AI Assistant của hệ thống gym. 
    Role-aware: tools được tự động lọc theo JWT token.
    Hoạt động với mọi role: Member, Staff, GymOwner, SuperAdmin.
    """
    return await call_backend("POST", "/api/ai/chat", auth_token, {"message": message})


@mcp.tool()
async def discover_tools(auth_token: str) -> str:
    """Xem danh sách AI tools khả dụng cho role của người dùng hiện tại."""
    return await call_backend("GET", "/api/ai/tools", auth_token)


@mcp.tool()
async def get_membership_info(auth_token: str) -> str:
    """[Member] Xem thông tin gói tập hiện tại: ngày hết hạn, số buổi PT/nhóm còn lại."""
    return await call_backend(
        "POST", "/api/ai/chat", auth_token,
        {"message": "Xem thông tin gói tập của tôi"}
    )


@mcp.tool()
async def get_branch_revenue(auth_token: str, month: int, year: int) -> str:
    """[BranchAdmin/GymOwner/SuperAdmin] Doanh thu chi nhánh theo tháng/năm."""
    return await call_backend(
        "POST", "/api/ai/chat", auth_token,
        {"message": f"Xem doanh thu tháng {month}/{year}"}
    )


@mcp.tool()
async def get_system_dashboard(auth_token: str) -> str:
    """[SuperAdmin/GymOwner] Dashboard KPI tổng quan toàn hệ thống."""
    return await call_backend(
        "POST", "/api/ai/chat", auth_token,
        {"message": "Xem dashboard KPI tổng quan"}
    )


@mcp.tool()
async def get_lead_summary(auth_token: str) -> str:
    """[Sales/BranchAdmin/SuperAdmin/GymOwner] Thống kê leads và tỷ lệ chuyển đổi."""
    return await call_backend(
        "POST", "/api/ai/chat", auth_token,
        {"message": "Thống kê leads tháng này"}
    )


if __name__ == "__main__":
    # FastMCP automatically handles setup, argument parsing, schemas, and stdio transport execution!
    mcp.run()
