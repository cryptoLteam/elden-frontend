import { ContextApi } from "@pancakeswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("Ecosystem"),
    items: [
      {
        label: t("Trade"),
        href: "/swap",
      },
      {
        label: t("Earn"),
        href: "/farms",
      },
      {
        label: t("Game"),
        href: "/prediction",
      },
      {
        label: t("NFT"),
        href: "/nfts",
      },
      {
        label: t("Tokenomics"),
        href: "https://docs.elden.fi/governance-and-tokenomics/cake-tokenomics",
      },
      {
        label: t("Litepaper"),
        href: "https://assets-eldenfi.netlify.app/litepaper/v2litepaper.pdf",
      },
      {
        label: t("CAKE Emission Projection"),
        href: "https://analytics.elden.fi/",
      },
      {
        label: t("Merchandise"),
        href: "https://merch.elden.fi/",
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        label: t("Farms and Syrup Pools"),
        href: "https://docs.elden.fi/ecosystem-and-partnerships/business-partnerships/syrup-pools-and-farms",
      },
      {
        label: t("IFO"),
        href: "https://docs.elden.fi/ecosystem-and-partnerships/business-partnerships/initial-farm-offerings-ifos",
      },
      {
        label: t("NFT Marketplace"),
        href: "https://docs.elden.fi/ecosystem-and-partnerships/business-partnerships/nft-market-applications",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: t("Contributing"),
        href: "https://docs.elden.fi/developers/contributing",
      },
      {
        label: t("Github"),
        href: "https://github.com/pancakeswap",
      },
      {
        label: t("Bug Bounty"),
        href: "https://docs.elden.fi/developers/bug-bounty",
      },
    ],
  },
  {
    label: t("Support"),
    items: [
      {
        label: t("Contact"),
        href: "https://docs.elden.fi/contact-us/customer-support",
      },
      {
        label: t("Troubleshooting"),
        href: "https://docs.elden.fi/readme/help/troubleshooting",
      },
      {
        label: t("Documentation"),
        href: "https://docs.elden.fi/",
      },
    ],
  },
  {
    label: t("About"),
    items: [
      {
        label: t("Terms Of Service"),
        href: "https://elden.fi/terms-of-service",
      },
      {
        label: t("Blog"),
        href: "https://blog.elden.fi/",
      },
      {
        label: t("Brand Assets"),
        href: "https://docs.elden.fi/ecosystem-and-partnerships/brand",
      },
      {
        label: t("Careers"),
        href: "https://docs.elden.fi/team/become-a-chef",
      },
    ],
  },
];
