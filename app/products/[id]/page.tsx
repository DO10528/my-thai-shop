// src/app/products/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const mockProducts = [
  {
    id: 1,
    name_th: "นมผง Meiji Step (800g)",
    desc_th: "นมผงคุณภาพจากญี่ปุ่น สำหรับเด็ก 1-3 ปี (ส่งตรงจากญี่ปุ่น)",
    price_thb: 650,
    image_url: "https://placehold.co/400x400/ffe4e6/ff80b5?text=Meiji+Step",
    detail_th: "นมผงเมจิสเตป สูตรยอดนิยมจากประเทศญี่ปุ่น อุดมไปด้วย DHA และสารอาหารที่จำเป็นต่อการเจริญเติบโตของสมองและร่างกาย เหมาะสำหรับเด็กวัย 1-3 ปี สินค้าเป็นของแท้ นำเข้าโดยตรงจากญี่ปุ่น มั่นใจได้ในคุณภาพและความปลอดภัย 100%"
  },
  {
    id: 2,
    name_th: "ผ้าอ้อม Merries (ไซส์ M / 64 ชิ้น)",
    desc_th: "ผ้าอ้อมสำเร็จรูปยอดฮิต นุ่มสบาย ระบายอากาศดีเยี่ยม",
    price_thb: 580,
    image_url: "https://placehold.co/400x400/e0f2fe/38bdf8?text=Merries",
    detail_th: "เมอร์รี่ส์ ผ้าอ้อมแบบเทป ที่สุดแห่งความนุ่มสบาย ไม่ระคายเคืองผิวบอบบางของลูกน้อย ซึมซับเยี่ยม แห้งสบายตลอดคืน"
  },
  {
    id: 3,
    name_th: "ขวดนม Pigeon สีชา (240ml)",
    desc_th: "ขวดนมคอกว้าง ทนความร้อนสูง เสมือนเต้านมแม่",
    price_thb: 420,
    image_url: "https://placehold.co/400x400/fef3c7/fbbf24?text=Pigeon",
    detail_th: "พีเจ้น ขวดนมคอกว้างสีชา ผลิตจากวัสดุ PPSU ทนความร้อนได้ถึง 180°C มาพร้อมจุกนมเสมือนการให้นมมารดา"
  }
];

// ★ 変更点1：async を追加し、params の型を Promise に変更
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  
  // ★ 変更点2：await を使って、URLから確実にIDを受け取る
  const resolvedParams = await params;
  
  // URLのIDと一致する商品を探す
  const product = mockProducts.find((p) => p.id.toString() === resolvedParams.id);

  // 見つからなければ404ページを表示
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white md:bg-gray-50 p-0 md:p-8">
      <div className="max-w-2xl mx-auto bg-white md:rounded-2xl md:shadow-lg overflow-hidden">
        
        <div className="p-4 bg-white border-b border-gray-100">
          <Link href="/" className="text-blue-600 text-sm font-bold flex items-center">
            ← กลับไปหน้าแรก (トップへ戻る)
          </Link>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url}
          alt={product.name_th}
          className="w-full h-64 md:h-96 object-cover"
        />

        <div className="p-5 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {product.name_th}
          </h1>
          <p className="text-3xl font-extrabold text-red-500 mb-6">
            ฿{product.price_thb}
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="font-bold text-gray-700 mb-2">รายละเอียดสินค้า (商品説明)</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.detail_th}
            </p>
          </div>

          <button className="w-full bg-[#00B900] text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-green-600 transition-colors">
            สั่งซื้อและชำระเงิน (購入・決済へ進む)
          </button>
        </div>

      </div>
    </main>
  );
}