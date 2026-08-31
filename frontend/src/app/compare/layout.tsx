import { ServiceWorkerRegistration } from "../../components/ServiceWorkerRegistration";

export default function CompareLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ServiceWorkerRegistration />
      {children}
    </>
  );
}
