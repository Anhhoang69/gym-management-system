import { useState, useEffect } from "react";
import PackageCard from "./PackageCard";
import RegisterModal from "../RegisterModal";
import { getPublicPackages } from "../../services/publicService";

import pkg1 from "../../../../assets/package-1.webp";
import pkg2 from "../../../../assets/package-2.webp";
import pkg3 from "../../../../assets/package-3.webp";

export default function PackageSection() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [selectedPackageId, setSelectedPackageId] = useState("");
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

    const handleRegisterClick = (packageId) => {
        setSelectedPackageId(packageId);
        setRegisterModalVisible(true);
    };

    return (
        <section className="bg-[var(--bg)] flex flex-col justify-start pt-8 lg:pt-12 pb-10 lg:pb-10">
            {/* HEADER */}
            <div className="text-center mx-auto mb-4 lg:mb-6 px-4">
                <h2 style={{ color: 'var(--brand)' }} className="text-3xl md:text-4xl font-extrabold text-yellow-500 tracking-tight mb-1">
                    Gói Tập Độc Quyền
                </h2>

                <p style={{ color: 'var(--text-primary)' }} className="block text-base md:text-lg italic --text-primary max-w-5xl mx-auto mt-0">
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
                    lg:grid-cols-4
                    gap-6 lg:gap-8
                    max-w-[1400px]
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
                                onRegister={() => handleRegisterClick(pkg.packageId)}
                            />
                        );
                    })}
                </div>
            )}

            <RegisterModal 
                visible={registerModalVisible} 
                setVisible={setRegisterModalVisible} 
                initialPackageId={selectedPackageId} 
            />
        </section>
    );
}
