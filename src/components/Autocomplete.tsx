import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import type { InputProps } from "./Input";

type AutocompleteProps<T extends { id: string; name: string }> = InputProps & {
  data: T[];
  label?: string;
  selected: T | undefined;
  setSelected: (args: T | undefined) => void;
  query: string;
  setQuery: (args: string | undefined) => void;
};

export default function Autocomplete<T extends { id: string; name: string }>({
  data,
  label,
  selected,
  setSelected,
  query,
  setQuery,
  errors,
  ...props
}: AutocompleteProps<T>) {
  return (
    <div className="mb-4">
      <label
        className="mb-2 block font-medium text-gray-700"
        htmlFor={props.name}
      >
        {label}
      </label>
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden">
            <Combobox.Input
              className="w-full appearance-none rounded border border-gray-400 px-3 py-2 leading-tight text-text focus:border-main focus:outline-none"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              displayValue={(item: { name: string }) => item.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {data.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                data.map((item) => (
                  <Combobox.Option
                    key={item.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-main text-white" : "text-gray-900"
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-main"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {props.name && errors?.[props.name] && (
        <p className="text-xs italic text-red-500">
          {errors[props.name]?.message}
        </p>
      )}
    </div>
  );
}
