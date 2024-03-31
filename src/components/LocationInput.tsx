import React from "react";
import { Input } from "~/components";
import { useDebounce } from "~/hooks";
import { api } from "~/utils/api";
import type { InputProps } from "./Input";
import type { PlaceInfo } from "~/server/api/routers/location";

type LocationInputProps = {
  placeholder?: string;
  onSelect: (args: PlaceInfo["result"] | undefined) => void;
} & Omit<InputProps, "onSelect">;

const LocationInput = React.forwardRef<HTMLInputElement, LocationInputProps>(
  ({ placeholder = "Πού πηγαίνουμε;", onSelect, onChange, ...props }, ref) => {
    const blurTimeoutRef = React.useRef<number | null>(null);
    const [input, setInput] = React.useState("");

    const [inputFocused, setInputFocused] = React.useState(false);
    const debouncedInput = useDebounce(input);
    const { data: predictions } = api.location.getPredictions.useQuery(
      { search: debouncedInput },
      { enabled: input.length > 0 },
    );

    const getPlaceInfo = api.location.getPlaceInfo.useMutation({
      onSuccess(data) {
        if (data) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error fu
          onSelect(data);
        }
      },
    });

    return (
      <>
        <Input
          autoComplete="off"
          placeholder={placeholder}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (onChange) onChange(e);
          }}
          onFocus={() => {
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
            }
            setInputFocused(true);
          }}
          onBlur={() => {
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
            }
            blurTimeoutRef.current = window.setTimeout(() => {
              setInputFocused(false);
            }, 500);
          }}
          ref={ref}
          {...props}
        />
        <div className="relative">
          {inputFocused &&
            Array.isArray(predictions) &&
            predictions?.length > 0 && (
              <ul className="absolute z-50 mt-[-12px] flex max-h-[250px] w-full flex-col overflow-y-auto rounded-lg border bg-white">
                {predictions?.map((prediction) => (
                  <li
                    className="w-full cursor-pointer border-b bg-white px-4 py-2 text-sm text-slate-500 hover:text-black"
                    key={prediction.place_id}
                    onClick={() => {
                      getPlaceInfo.mutate({
                        placeId: prediction.place_id,
                      });
                      setInput(prediction.description);
                      setInputFocused(false);
                    }}
                  >
                    {prediction.description}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </>
    );
  },
);

export default LocationInput;

LocationInput.displayName = "LocationInput";
