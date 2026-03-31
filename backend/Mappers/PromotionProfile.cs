using AutoMapper;
using backend.DTOs.Promotion;
using backend.Models;

namespace backend.Mappers;

public class PromotionProfile : Profile
{
    public PromotionProfile()
    {
        CreateMap<Promotion, PromotionDto>()
            .ForMember(d => d.PackageName,
                opt => opt.MapFrom(s => s.ApplicablePackage != null ? s.ApplicablePackage.Name : null))
            .ForMember(d => d.BranchName,
                opt => opt.MapFrom(s => s.ApplicableBranch != null ? s.ApplicableBranch.Name : null))
            .ForMember(d => d.CreatedByName,
                opt => opt.MapFrom(s => s.CreatedByUser.FullName));

        CreateMap<Promotion, PromotionListDto>()
            .ForMember(d => d.BranchName,
                opt => opt.MapFrom(s => s.ApplicableBranch != null ? s.ApplicableBranch.Name : null));

        CreateMap<UpdatePromotionDto, Promotion>();
    }
}