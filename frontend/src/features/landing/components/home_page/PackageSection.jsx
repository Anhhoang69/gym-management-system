import { useState, useEffect } from "react";
import PackageCard from "./PackageCard";
import { getPublicPackages } from "../../services/publicService";

import pkg1 from "../../../../assets/package-1.webp";
import pkg2 from "../../../../assets/package-2.webp";
import pkg3 from "../../../../assets/package-3.webp";

export default function PackageSection() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const defaultImages = [pkg1, pkg2, pkg3];


    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getPublicPackages();
                // Sort by price or just use as-is.
                setPackages(data || []);
            } catch (error) {
                console.error("Failed to fetch packages", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    return (
        <section className="min-h-screen bg-[var(--bg)] flex flex-col justify-center py-10 lg:py-10">
            {/* HEADER */}
            <div className="text-center mx-auto mb-2 lg:mb-8">
                <h2 style={{ color: 'var(--brand)' }} className="text-3xl md:text-4xl font-extrabold text-yellow-500 tracking-tight">
                    Gói Tập Độc Quyền
                </h2>

                <p style={{ color: 'var(--text-primary)' }} className="block text-xl md:text-2xl italic --text-primary max-w-5xl mx-auto">
                    EnerGym mang đến các gói tập được thiết kế linh hoạt,
                    phù hợp với nhiều mục tiêu và trình độ khác nhau.
                </p>
            </div>

            {/* CARDS */}
            {loading ? (
                <div className="text-center text-[var(--text-secondary)] mt-10">Đang tải gói tập...</div>
            ) : (
                <div className="
                    mt-6 lg:mt-8
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-10
                    max-w-7xl
                    mx-auto
                    px-6
                ">
                    {packages.map((pkg, index) => {
                        // Find 1-month pricing or use the first one
                        const pricing = pkg.pricings?.find(p => p.durationMonths === 1) || pkg.pricings?.[0];
                        const price = pricing ? pricing.price.toLocaleString('vi-VN') : "Liên hệ";
                        const period = pricing ? (pricing.durationMonths === 1 ? "tháng" : `${pricing.durationMonths} tháng`) : "tháng";
                        
                        return (
                            <PackageCard
                                key={pkg.packageId}
                                image={defaultImages[index % defaultImages.length]}
                                title={pkg.name}
                                price={price}
                                period={period}
                                highlight={index === 1 || pkg.tier === 'Premium' || pkg.tier === 'Elite'}
                                description={pkg.description}
                                features={pkg.features?.map(f => ({ label: f, available: true })) || []}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}
