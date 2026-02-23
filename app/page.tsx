// app/products/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// ★ 先ほど直していただいた正しいパス（環境に合わせて調整してください）
import { supabase } from '@/lib/supabase';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // ★ Supabaseから、URLのIDと一致する商品を「1件だけ（.single()）」取得する
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  // 万が一商品が見つからなかったりエラーになった場合は404ページへ
  if (error || !product) {
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
        <img src={product.image_url} alt={product.name_th} className="w-full h-64 md:h-96 object-cover" />

        <div className="p-5 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name_th}</h1>
          <p className="text-3xl font-extrabold text-red-500 mb-6">฿{product.price_thb}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="font-bold text-gray-700 mb-2">รายละเอียดสินค้า (商品説明)</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.detail_th}</p>
          </div>

          {/* 変更前（<button>...）を消して、以下に差し替えます */}
          <Link 
            href={`/checkout/${product.id}`}
            className="w-full block text-center bg-[#00B900] text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-green-600 transition-colors"
          >
            สั่งซื้อและชำระเงิน (購入・決済へ進む)
          </Link>
        </div>

      </div>
    </main>
  );
}