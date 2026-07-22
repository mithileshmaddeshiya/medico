import Image from "next/image";

export default function CallOrderBanner() {
  return (
    <section className="w-full py-3 px-5 rounded-2xl bg-[#eef5fb]">
      <a href="tel:9891233525" className="block">
        <img
          src="/callimg/contactimg.webp"
          alt="Call and Order"
          className="w-full h-auto rounded-2xl"
        />
      </a>
    </section>
  );
}