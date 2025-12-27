"use client";
import { NavbarNested } from "@/app/order/components/NavBar";
import { ReactNode } from "react";

interface BaseLayoutProps {
  children: ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#000000] px-10 py-3">
          <div className="flex items-center gap-4 text-[#000000]">
            <div className="size-4">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#000000] text-lg font-bold leading-tight tracking-[-0.015em]">
              SwiftShip
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a
                className="text-[#000000] text-sm font-medium leading-normal"
                href="#"
              >
                Dashboard
              </a>
              <a
                className="text-[#000000] text-sm font-medium leading-normal"
                href="#"
              >
                Orders
              </a>
              <a
                className="text-[#000000] text-sm font-medium leading-normal"
                href="#"
              >
                Pricing
              </a>
              <a
                className="text-[#000000] text-sm font-medium leading-normal"
                href="#"
              >
                Support
              </a>
            </div>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#000000] text-[#000000] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <div
                className="text-[#ffffff]"
                data-icon="Bell"
                data-size="20px"
                data-weight="regular"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                </svg>
              </div>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"></div>
          </div>
        </header>
        <main className=" flex grow">
          <NavbarNested />
          {children}
        </main>
      </div>
    </div>
  );
};
