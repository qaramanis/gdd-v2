import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Image
        src="/login2.jpg"
        alt="Logo"
        fill
        className="object-cover object-center absolute inset-0 -z-10"
      />
      {children}
    </div>
  );
}
