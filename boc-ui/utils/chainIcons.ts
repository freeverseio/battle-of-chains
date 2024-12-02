import arbitrumPixelated from "@/public/logos/arbitrumPixelated.svg";
import polygonPixelated from "@/public/logos/polygonPixelated.svg";
import ethereumPixelated from "@/public/logos/ethereumPixelated.svg";
// Mapping of chain IDs to their corresponding icons
export const chainIcons: { [key: number]: string } = {
    1: ethereumPixelated,
    137: polygonPixelated,
    42161: arbitrumPixelated,
  };