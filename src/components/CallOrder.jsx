import Image from "next/image";

export default function CallOrderBanner() {
  return (
     <section className="w-full py-3 px-5 rounded-2xl bg-[#eef5fb]">

      <a href="tel:6392108234" className="block">
        <div className="max-w-md mx-auto overflow-hidden rounded-2xl">
          <Image
            src="/callimg/contactimg.webp"
            alt="Call and Order"
            width={1000}
            height={500}
            className="w-full h-auto object-cover rounded-2xl"
            priority
          />
        </div>
      </a>

    </section>
  );
}