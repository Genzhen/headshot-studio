"use client";

import { useMemo, useState } from "react";

import FilterBar from "./filter-bar";
import PhotoCard, { type PhotoCategory } from "./photo-card";

interface Photo {
  id: string;
  category: PhotoCategory;
  title: string;
  image: string;
}

const photos: Photo[] = [
  {
    id: "corporate-1",
    category: "Corporate",
    title: "Executive Profile",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6eMDw1lFQb37d7BJxxk0piU0iUsHACYwULCQjpmmdWx4-u6l_BALM31DYa6tiMNhMDlrDM2R241SUWXoV0b1QbieO6y87XbuQQZAFZknNc9i29KB6v6Uo59SLvzu63DNLWBmz-SHrdsF0TOUux-G11G_0AMTsMa3R6uBtulUH6bM37AsrZ2fFC7Y3mxnVz6pq4KxMNPSvxOJ0eglO2rgQeIqcHhxYdMudtj7vYPg0a-i-Tts0HIlOxao-9t0OS-NHyLu3m2MNkA",
  },
  {
    id: "creative-1",
    category: "Creative",
    title: "Art Director",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTPiWr86DzU_e5X0mr8BEtvMeKWU83fGnPyjwBROfOtp1YN7TQIT6UyaeyyHr2E65BiB0NfJse4LDZ4B2EqQxULstUoWaREWD6VRJJzyO5VTLpNvwH8CUudNQNWT14oxlYLt-O45WaLi19i-cguo5gUmmZn2BXCchOibkVXgt0XEkmolbvP1jHpxbLtOnojoT8StEX-MuORd3OE3xxZ57S6_gIlXzXReYEwesrB2jcdwNpLDudgmb5tkUFVNn16lm8jvhzx4YK1w",
  },
  {
    id: "outdoor-1",
    category: "Outdoor",
    title: "Entrepreneur",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsJk8PZgcgOZ4M-NWx1uGBb89SVUnQCA5NRdmkfLP_ECUOYjMN-D1-MpK_vuMSQTNZnMCMf9tzXoINQllMzODeptimGgKMDt0o1X1GxZ0iJ99ZBDR-LODiYzpfQHpSnUodCn0BlfaxCuMk0moD-ROP2HxXgiXEzOPtHPwG9Aqm_hZENGunihg6MsPOUsvPtF5zWvmfrNYw_DfLBslwHF60bxjad7RztPslVLuVLD02YZuIV5cJv9ClhLDfq5IBmqP47Rt5hGmNqQ",
  },
  {
    id: "medical-1",
    category: "Medical",
    title: "Specialist Surgeon",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ8bJLqvMlRIWkiZHbGUAyzrY4z4STP5Bo4QVcPpp-UPNQBGOCi_KKQ_0TmzSVNfhmoGBznPwZmVVVDpLh38AEQtwpIDw7Y64qg2GMUzx18ZgbsJsPVQ2Zkuwsl9B0-E18uTA3LaElxW6rOJsYzY8yYkuIXb_W89XPs1in24Qf8rfTdR6c_ULlF1lxxz4xPlKVgZvhzamvbBEC6YvSO5wihQSl84Qi5nb0bPTub0hu1SbeEyh294kkxFxfvXHpxHhSNODRmu1llA",
  },
  {
    id: "corporate-2",
    category: "Corporate",
    title: "Senior Consultant",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVs9HY8yhiPFugyApdd-cCCvtOCSxDfEVC9UjiOhy7V-zPj4KsS--TLU9umw5MQ1b386Yg5aME87Jt09nnSRVL34dcyGn73foyDKUXvcgVrYsQkcqBCPgMZrvbHV3uEk8oZHKM3-p5K_WSBFmkDxa_48IReV8Lv1N4MpsF32dU59-qKScx9QPie9FylAWsfaeSRUR4IwYzsLIEgELgTYQUwNg68UPs59Bu3-P-VnfepyuFBlRL0oqXxxrnluAzn_1w6gUf11CLfw",
  },
  {
    id: "creative-2",
    category: "Creative",
    title: "UX Architect",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAaUSYkE4_N9oVE4vX33wTK993IcgZvU9zRNtz2jFTdwJNAEYkB0RUJh-yEViZrkR36YwBuavYXVnQkH5eOEuC3nUhIa4aXjInWfdW6qQH-_tcMjzJP5AEqWGP51G3CB82usOKR08xaqSBvu5-A565uhS3kfilMokcXsdemi6OfknUlemcYGevQPM7hKUeflGckmkXQpoI537zKngD89Jmb4auamupQvGylPrfVRmkj0A10RXie2a35qDU_ROKYrqxclp55jOg2EA",
  },
  {
    id: "medical-2",
    category: "Medical",
    title: "Research Lead",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVgL1jhgO-d_5jMxtqcNZPx7h29qkdbo2Q5YlJYki6m2F9rw1Ma6pKwwhDtoyD7Oqmqhf-Kzdon7kJvyj1LeGTVJF54kSLfn9llBew6j9GAmqZ0tSR4BA6JdJD-G--Szckj5UnaK1ZiBevy51qdMrs-RGDPWHtPhUHHbN2BAIh4chs92vDVSvpkSmhD2L1xAaJJAIGG9oKeaaDRKEjuyRSbQ7c6lFuvd03rjQjz1FfDaLELyTBtizYJUCTvWPShv7SkbJIB1_Ugg",
  },
  {
    id: "corporate-3",
    category: "Corporate",
    title: "Founding Partner",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVZyWW01Q1bvGzgzZfFSsIjl-AHaW9AxW135N1Q4MnyDOOT4ceR1rsSX4QOHBy_-GSF7IPvRdIMyZKEW-CLvdCkG6eEAsgOj9Wi5HSWPfxj0aRE-qqAWRx9gS2mzew9izoNWkPJVNNvgAuxxYZlcJBSKD-3RNyHgVqXCPT5JnkxkeMciUN64e2BpMbtfVb714GzHcL_McT3L9bc9y9O54IredtFIKU3lY5UUaKCWRuw59W5U4D1VMHOA2yRPe7rpoknMPBRPSg2Q",
  },
];

export default function PhotoGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") {
      return photos;
    }

    return photos.filter((photo) => photo.category === activeCategory);
  }, [activeCategory]);

  return (
    <div>
      <FilterBar
        categories={["All", "Corporate", "Creative", "Outdoor", "Medical"]}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="grid grid-cols-2 gap-[var(--spacing-gutter)] transition-all duration-500 md:grid-cols-3 lg:grid-cols-4">
        {filteredPhotos.map((photo) => (
          <PhotoCard
            key={photo.id}
            category={photo.category}
            title={photo.title}
            image={photo.image}
          />
        ))}
      </div>
    </div>
  );
}
