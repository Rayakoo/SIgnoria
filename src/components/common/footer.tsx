import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#FBFDFD] py-20 px-8 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between gap-12">
          {/* Logo Section */}
          <div className="max-w-[305px]">
            <Image
              src="assets/logo/logo_text.svg" 
              alt="Signoria Logo"
              width={150}
              height={50}
              className="mb-6"
            />
            <p className="text-[#181818] text-lg leading-relaxed">
              Belajar kapan pun dan di mana pun. Interaktif, inklusif, dan disesuaikan kemampuan mu. Bergabunglah dengan
              komunitas kami!
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h4 className="text-[#181818] text-xl font-bold mb-6">Fitur</h4>
            <ul className="space-y-4">
              <li className="text-[#181818] text-lg">Belajar</li>
              <li className="text-[#181818] text-lg">Kamus</li>
              <li className="text-[#181818] text-lg">Peringkat</li>
              <li className="text-[#181818] text-lg">Profil</li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-[#181818] text-xl font-bold mb-6">Dukungan</h4>
            <ul className="space-y-4">
              <li className="text-[#181818] text-lg">FAQ</li>
              <li className="text-[#181818] text-lg">Kontak</li>
              <li className="text-[#181818] text-lg">Kebijakan Privasi</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}