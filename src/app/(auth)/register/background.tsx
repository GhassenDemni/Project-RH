"use client"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div
      style={{
        position: "relative",
        left: "-2rem",
        maxWidth: "650px",
      }}
      className="relative hidden h-full lg:block"
    >
      <Image
        style={{ objectFit: "cover" }}
        src={"/images/next-step.jpg"}
        alt="Register page image"
        priority={true}
        fill
        quality={100}
      />
      <div className="absolute bottom-2 right-40 z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-2xl">
            NextStep IT. &ldquo;For your safety.&rdquo;
          </p>
        </blockquote>
      </div>
    </div>
  )
}
