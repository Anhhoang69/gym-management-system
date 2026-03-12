using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.Interfaces;
using backend.DTOs.Branch;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/branches")]
public class BranchController : ControllerBase
{
    private readonly IBranchService _service;

    public BranchController(IBranchService service)
    {
        _service = service;
    }

    // View Branch List
    [HttpGet]
    public async Task<ApiResponse<List<BranchListDto>>> GetBranches(
        string? search,
        string? status)
    {
        var result = await _service.GetBranchesAsync(search, status);

        return new ApiResponse<List<BranchListDto>>(result);
    }

    // Get Branch Detail
    [HttpGet("{id}")]
    public async Task<ApiResponse<BranchListDto?>> GetBranch(Guid id)
    {
        var result = await _service.GetBranchAsync(id);

        if (result == null)
            return new ApiResponse<BranchListDto?>("Branch not found");

        return new ApiResponse<BranchListDto?>(result);
    }

    // UPDATE REQUEST

    [HttpPut("{id}")]
    public async Task<ApiResponse<bool>> UpdateBranch(Guid id, UpdateBranchDto dto)
    {
        //var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");
        var result = await _service.UpdateBranchAsync(id, dto, userId);

        if (!result)
            return new ApiResponse<bool>("Branch not found");

        return new ApiResponse<bool>(true, "Update request submitted");
    }

    // DEACTIVATE REQUEST

    [HttpDelete("{id}")]
    public async Task<ApiResponse<bool>> DeactivateBranch(Guid id)
    {
        //var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var userId = Guid.Parse("daafff73-5a97-449e-9779-3e179d0db93c");
        var result = await _service.DeactivateBranchAsync(id, userId);

        if (!result)
            return new ApiResponse<bool>("Branch not found");

        return new ApiResponse<bool>(true, "Deactivate request submitted");
    }

    [HttpPost("requests/{requestId}/approve")]
    public async Task<ApiResponse<bool>> ApproveRequest(Guid requestId)
    {
        var userId = Guid.Parse("4d7accb4-59ea-409c-b9d2-d0231115b15a");

        var result = await _service.ApproveBranchRequestAsync(requestId, userId);

        if (!result)
            return new ApiResponse<bool>("Request not found");

        return new ApiResponse<bool>(true, "Request approved");
    }

    [HttpPost("requests/{requestId}/reject")]
    public async Task<ApiResponse<bool>> RejectRequest(
    Guid requestId,
    string? message)
    {
        var userId = Guid.Parse("4d7accb4-59ea-409c-b9d2-d0231115b15a");

        var result = await _service.RejectBranchRequestAsync(requestId, userId, message);

        if (!result)
            return new ApiResponse<bool>("Request not found");

        return new ApiResponse<bool>(true, "Request rejected");
    }

    // [HttpPost]
    // public async Task<ApiResponse<bool>> CreateBranch(CreateBranchDto dto)
    // {
    //     var userId = Guid.Parse("4d7accb4-59ea-409c-b9d2-d0231115b15a");

    //     var result = await _service.CreateBranchAsync(dto, userId);

    //     if (!result)
    //         return new ApiResponse<bool>("Cannot create branch request");

    //     return new ApiResponse<bool>(true, "Branch creation request sent");
    // }
}