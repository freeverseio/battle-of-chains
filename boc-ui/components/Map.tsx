"use client";

import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import Projection from "ol/proj/Projection";
import "ol/ol.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chainIcons } from "@/utils/chainIcons";
import Image from "next/image";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Overlay from "ol/Overlay";
import { defaults as defaultControls } from "ol/control";
import { useAllUsers } from "hooks/useAllUsers";
import { useAllChains } from "hooks/useAllChains";
import { addressToCoordinates } from "utils/addressToCoordinates";
import { mapCoordinates } from "utils/mapCoordinates";
import { useAccount } from "wagmi";
import { PlayerTooltip } from "./PlayerTooltip";
import ReactDOM from "react-dom";

export const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObjectRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const tooltipRef = useRef<Overlay | null>(null);
  const userOverlayRef = useRef<Overlay | null>(null);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useAllUsers();
  const {
    data: chainsData,
    loading: chainsLoading,
    error: chainsError,
  } = useAllChains();
  const { address: loggedUserAddress } = useAccount();

  const [selectedChainId, setSelectedChainId] = useState<number | null>(1);

  useEffect(() => {
    const extent: [number, number, number, number] = [0, 0, 1024, 1024];
    const projection = new Projection({
      code: "custom-image",
      units: "pixels",
      extent: extent,
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const chainId = feature.get("chainId");
        const isHomechain = feature.get("isHomechain");
        const isLoggedUser = feature.get("isLoggedUser");

        return new Style({
          image: new Icon({
            src: isHomechain
              ? `/map/chain_${chainId}/homechain.svg`
              : `/map/chain_${chainId}/point.svg`,
            scale: 1,
            opacity: isLoggedUser ? 0 : 1,
          }),
        });
      },
    });

    const map = new Map({
      target: mapRef.current!,
      layers: [
        new ImageLayer({
          source: new ImageStatic({
            url: "/square_grid.jpg",
            projection: projection,
            imageExtent: extent,
          }),
        }),
        vectorLayer,
      ],
      controls: defaultControls(),
      view: new View({
        projection: projection,
        center: [extent[2] / 2, extent[3] / 2],
        zoom: 2,
        maxZoom: 4,
        minZoom: 1.5,
        extent: extent,
        constrainOnlyCenter: true,
      }),
    });

    // Create tooltip container
    const tooltipElement = document.createElement("div");
    tooltipElement.className = "tooltip-container";
    const tooltipOverlay = new Overlay({
      element: tooltipElement,
      offset: [0, 0],
      positioning: "center-left",
    });
    map.addOverlay(tooltipOverlay);
    tooltipRef.current = tooltipOverlay;

    // Create user overlay
    const userElement = document.createElement("div");
    userElement.className = "animate-pulse p-16";
    userOverlayRef.current = new Overlay({
      element: userElement,
      positioning: "center-center",
    });
    map.addOverlay(userOverlayRef.current);

    // Variable to track whether the tooltip should remain visible
    let tooltipVisible = false;

    // Add event listeners to the tooltip element
    tooltipElement.addEventListener("pointerenter", () => {
      tooltipVisible = true;
    });

    tooltipElement.addEventListener("pointerleave", () => {
      tooltipVisible = false;
      tooltipElement.style.display = "none";
    });

    // Handle pointer movement
    map.on("pointermove", (evt) => {
      if (tooltipVisible) {
        return;
      }

      const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);

      if (feature) {
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        tooltipOverlay.setPosition(coordinates);

        const chainId = feature.get("chainId");
        const chainName =
          chainsData?.allChains.nodes.find(
            (chain: any) => chain.chainId === chainId
          )?.name || "Unknown Chain";

        ReactDOM.render(
          <PlayerTooltip
            address={feature.get("address")}
            name={feature.get("name")}
            coordinates={feature.get("coordinates")}
            treasury={feature.get("treasury")}
          />,
          tooltipElement
        );
        tooltipElement.style.display = "block";
      } else {
        tooltipElement.style.display = "none";
      }
    });

    map.getViewport().addEventListener("mouseleave", () => {
      if (!tooltipVisible) {
        tooltipElement.style.display = "none";
      }
    });

    mapObjectRef.current = map;
    vectorLayerRef.current = vectorLayer;
    vectorSourceRef.current = vectorSource;

    return () => {
      tooltipElement.removeEventListener("pointerenter", () => {});
      tooltipElement.removeEventListener("pointerleave", () => {});
      if (map) {
        map.setTarget(undefined);
        ReactDOM.unmountComponentAtNode(tooltipElement);
      }
    };
  }, [chainsData]);

  // Update features when data changes
  useEffect(() => {
    if (
      userLoading ||
      userError ||
      !userData?.allUsers ||
      selectedChainId === null
    )
      return;

    const features = userData.allUsers.nodes.map((user: any) => {
      const { address, chainByHomechain, name, treasury, score } = user;
      const homechainId = chainByHomechain?.chainId;
      const isHomechain = homechainId === selectedChainId;
      const { x, y } = addressToCoordinates(address);
      const { x: xCoord, y: yCoord } = mapCoordinates(x, y);
      const isLoggedUser =
        loggedUserAddress?.toLowerCase() === address.toLowerCase();

      if (isLoggedUser) {
        const userElement = userOverlayRef.current?.getElement();
        if (userElement) {
          userElement.innerHTML = `
            <img src="${
              isHomechain ? "/map/user/homebase.svg" : "/map/user/point.svg"
            }" class="animate-pulse" />
          `;
          userOverlayRef.current?.setPosition([xCoord, yCoord]);
        }
      }

      const feature = new Feature({
        geometry: new Point([xCoord, yCoord]),
      });

      feature.setProperties({
        chainId: selectedChainId,
        isHomechain,
        address,
        name,
        score,
        isLoggedUser,
        treasury,
        coordinates: [x, y],
      });

      return feature;
    });

    vectorSourceRef.current?.clear();
    vectorSourceRef.current?.addFeatures(features);
  }, [userData, userLoading, userError, selectedChainId, loggedUserAddress]);

  return (
    <div className="relative">
      {chainsLoading && <p>Loading chains...</p>}
      {chainsError && <p>Error loading chains</p>}
      {chainsData && (
        <div className="absolute -top-16 left-2 z-10 w-[200px]">
          <Select
            value={selectedChainId?.toString() ?? ""}
            onValueChange={(value) =>
              setSelectedChainId(value ? Number(value) : null)
            }
          >
            <SelectTrigger className="w-full bg-transparent text-xl focus:ring-0">
              <SelectValue placeholder="Select a Chain" />
            </SelectTrigger>
            <SelectContent>
              {chainsData.allChains.nodes.map((chain: any) => (
                <SelectItem
                  key={chain.chainId}
                  value={chain.chainId.toString()}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    {chainIcons[chain.chainId] && (
                      <Image
                        src={chainIcons[chain.chainId]}
                        alt={chain.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    )}
                    <span className="text-xl">{chain.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div ref={mapRef} className="w-full h-screen mt-12" />
    </div>
  );
};
