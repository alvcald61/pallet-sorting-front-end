import { AddressFormProps } from "@/lib/types/palletType";

type Props = {
  title: string;
  address: AddressFormProps;
  setAddress: (address: AddressFormProps) => void;
  edit?: boolean;
  disabled?: boolean;
};

export const AddressForm = ({
  title,
  address,
  setAddress,
  edit = true,
}: Props) => {
  return (
    <div className="">
      <h2 className="text-[#111418]  text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {title}
      </h2>
      <div className="bg-white  p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="flex flex-col">
              <p className="text-[#111418]  text-base font-medium leading-normal pb-2">
                Direccion
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418]  focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6]  bg-white  focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                placeholder="Ingresar la direccion"
                value={address.address}
                onChange={(e) => {
                  setAddress({ ...address, address: e.target.value });
                }}
                disabled={!edit}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              <p className="text-[#111418]  text-base font-medium leading-normal pb-2">
                Distrito
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418]  focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6]  bg-white  focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                placeholder="Ingresar la ciudad"
                value={address.district}
                onChange={(e) => {
                  setAddress({ ...address, district: e.target.value });
                }}
                disabled={!edit}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              <p className="text-[#111418]  text-base font-medium leading-normal pb-2">
                Ciudad
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418]  focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6]  bg-white  focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                placeholder="Ingresar la ciudad"
                value={address.city}
                onChange={(e) => {
                  setAddress({ ...address, city: e.target.value });
                }}
                disabled={!edit}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              <p className="text-[#111418]  text-base font-medium leading-normal pb-2">
                Departamento
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418]  focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6]  bg-white  focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                placeholder="Ingresar el departamento"
                value={address.state}
                onChange={(e) => {
                  setAddress({ ...address, state: e.target.value });
                }}
                disabled={!edit}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              <p className="text-[#111418]  text-base font-medium leading-normal pb-2">
                Enlace de la direccion
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418]  focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6]  bg-white  focus:border-primary h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                placeholder="Ingresar el enlace de la direccion"
                value={address.locationLink || ""}
                onChange={(e) => {
                  setAddress({ ...address, locationLink: e.target.value });
                }}
                disabled={!edit}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
