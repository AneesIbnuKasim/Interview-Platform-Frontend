import { memo, useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP } from "react-icons/fa";
import { FaCcPaypal, FaCcVisa, FaCcStripe } from "react-icons/fa6";
import { SiKlarna } from "react-icons/si";
import { ChevronDown } from "lucide-react";

const Footer = memo(() => {
  const [openIndex, setOpenIndex] = useState(null);

  const footerLinks = [
    {
      title: "TOP CATEGORIES",
      links: [
        "Laptops",
        "PC & Computers",
        "Cell Phones",
        "Tablets",
        "Gaming & VR",
        "Networks",
        "Cameras",
        "Sounds",
        "Office",
      ],
    },
    {
      title: "COMPANY",
      links: ["About Swco", "Contact", "Career", "Blog", "Sitemap", "Store Locations"],
    },
    {
      title: "HELP CENTER",
      links: [
        "Customer Service",
        "Policy",
        "Terms & Conditions",
        "Track Order",
        "FAQs",
        "My Account",
        "Product Support",
      ],
    },
    {
      title: "PARTNER",
      links: ["Become Seller", "Affiliate", "Advertise", "Partnership"],
    },
  ];

  const toggleColumn = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer className="w-full bg-gray-200 shadow-md pt-10 md:pt-14 dark:bg-[var(--color-bg-card)]">
      <div className="max-w-360 mx-auto px-4 md:px-10">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 pb-10">

          {/* BRAND */}
          <div>
            <h3 className="font-bold text-[15px] tracking-wide text-center md:text-left">
              VENTARO - WHERE QUALITY MEETS YOU
            </h3>

            <div className="mt-6 text-sm leading-6 text-center md:text-left">
              <p>CONTACT US</p>
              <p>
                257 Thatcher Road St, Brooklyn, Manhattan,<br />
                NY 10092
              </p>
              <p>contact@ventaro.com</p>
            </div>

            <div className="flex justify-center md:justify-start items-center gap-4 mt-6 text-gray-700">
              <FaFacebookF className="hover:text-black cursor-pointer" size={18} />
              <FaInstagram className="hover:text-black cursor-pointer" size={18} />
              <FaPinterestP className="hover:text-black cursor-pointer" size={18} />
              <FaYoutube className="hover:text-black cursor-pointer" size={18} />
            </div>
          </div>

          {/* LINK COLUMNS */}
          {footerLinks.map((col, index) => (
            <div key={col.title} className="border-b md:flex md:flex-col items-center md:border-none pb-2 md:pb-0">

              {/* MOBILE HEADER */}
              <button
                onClick={() => toggleColumn(index)}
                className="w-full flex items-center justify-between md:block"
              >
                <h3 className="font-semibold text-[15px] mb-2 md:mb-4">
                  {col.title}
                </h3>

                <ChevronDown
                  className={`md:hidden transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  size={18}
                />
              </button>

              {/* LINKS */}
              <ul
                className={`
                  overflow-hidden transition-all duration-300
                  ${openIndex === index ? "max-h-96" : "max-h-0"}
                  md:max-h-none
                  flex flex-col gap-2 text-sm text-gray-600
                `}
              >
                {col.links.map((item) => (
                  <li
                    key={item}
                    className="cursor-pointer hover:text-black transition py-1"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t py-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm text-gray-500 text-center md:text-left">
            © 2025 <span className="font-semibold">Ventaro</span>. All Rights Reserved
          </p>

          <div className="flex items-center gap-5 text-gray-700">
            <FaCcPaypal size={32} />
            <FaCcVisa size={32} />
            <FaCcStripe size={32} />
            <SiKlarna size={32} />
          </div>

        </div>
      </div>
    </footer>
  );
});

export default Footer;