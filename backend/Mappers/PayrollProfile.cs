using AutoMapper;
using backend.DTOs.Payroll;
using backend.Models;

namespace backend.Mappers;

public class PayrollProfile : Profile
{
    public PayrollProfile()
    {
        CreateMap<PayrollFormula, PayrollFormulaDto>();

        CreateMap<PayrollRecord, PayrollRecordDto>()
            .ForMember(dest => dest.StaffName, opt => opt.MapFrom(src => src.Staff.User.FullName))
            .ForMember(dest => dest.Position, opt => opt.MapFrom(src => src.Staff.Position.ToString()))
            .ForMember(dest => dest.FormulaName, opt => opt.MapFrom(src => src.Formula.Name));
    }
}
