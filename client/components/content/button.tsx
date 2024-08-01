import Link from "next/link";
import { Button } from "@/components/button";
import { UrlObject } from "url";

type Thref = {
  url: UrlObject;
  text: string;
};

export default function NavigationButtons({
  hrefs,
}: {
  hrefs: readonly Thref[];
}) {
  return (
    <div className="flex justify-between mt-4">
      {hrefs?.map((d, i) => (
        <Link href={d?.url} key={i}>
          <Button type="button">{d?.text}</Button>
        </Link>
      ))}
    </div>
  );
}
