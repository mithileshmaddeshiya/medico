import Image from "next/image";

export default function CallOrderBanner() {
  return (
    <section className="w-full py-3 px-5 rounded-2xl bg-[#eef5fb]">
      <a href="tel:9891233525" className="block">
        {/* next/image, not a raw <img>: the source is 1983x793 and was being
            served at full size to every phone. width/height are the file's own
            dimensions, so the aspect ratio is reserved before it loads and the
            banner cannot shift the page under the reader's thumb. */}
        <Image
          src="/callimg/contactimg.webp"
          alt="Call karke order kijiye — MedicoBharat, subah 8 se raat 10 baje tak"
          width={1983}
          height={793}
          sizes="(max-width: 768px) 100vw, 640px"
          className="w-full h-auto rounded-2xl"
        />
      </a>
    </section>
  );
}