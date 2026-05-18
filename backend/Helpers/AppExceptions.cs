namespace backend.Helpers;

/// <summary>400 – violates a business rule (duplicate, invalid state, etc.)</summary>
public class BusinessException : Exception
{
    public BusinessException(string message) : base(message) { }
}

/// <summary>404 – resource not found</summary>
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

/// <summary>401 – not authenticated</summary>
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message) { }
}

/// <summary>403 – authenticated but not allowed</summary>
public class ForbiddenException : Exception
{
    public ForbiddenException(string message) : base(message) { }
}

/// <summary>409 – conflict (e.g. duplicate)</summary>
public class ConflictException : Exception
{
    public ConflictException(string message) : base(message) { }
}
