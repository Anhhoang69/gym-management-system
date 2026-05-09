using AutoMapper;
using backend.DTOs.Package;
using backend.Models;

namespace backend.Mappers;

public class PackageProfile : Profile
{
    public PackageProfile()
    {
        CreateMap<Package, PackageDto>()
            .ForMember(d => d.Policy, opt => opt.MapFrom(s => s.PackagePolicy))
            .ForMember(d => d.TotalSubscribers,
                opt => opt.MapFrom(s => s.Contracts.Count));

        CreateMap<PackageFeature, PackageFeatureDto>().ReverseMap();

        CreateMap<PackagePricing, PackagePricingDto>().ReverseMap();

        CreateMap<PackagePolicy, PackagePolicyDto>().ReverseMap();

        CreateMap<UpdatePackageDto, Package>();

        CreateMap<CreatePackageDto, Package>()
            .ForMember(d => d.PackagePolicy, opt => opt.MapFrom(s => s.Policy));
    }
}