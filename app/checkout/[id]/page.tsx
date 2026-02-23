// app/checkout/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase'; // パスは環境に合わせて調整してください

export default async function Checkout({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // どの商品を買おうとしているか、データベースから取得
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !product) {
    notFound();
  }

  // 配送料（一律50バーツと仮定）
  const shippingFee = 50;
  const totalAmount = Number(product.price_thb) + shippingFee;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 左側：購入者情報の入力フォーム */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">ข้อมูลการจัดส่ง (配送先情報)</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล (氏名)</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B900]" placeholder="สมหญิง รักดี" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ (電話番号)</label>
              <input type="tel" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B900]" placeholder="0812345678" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่จัดส่ง (住所)</label>
              <textarea className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B900] h-24" placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"></textarea>
            </div>
          </form>
        </div>

        {/* 右側：注文内容の確認と支払いボタン */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6">สรุปคำสั่งซื้อ (注文の確認)</h2>
          
          <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image_url} alt={product.name_th} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
            <div>
              <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{product.name_th}</h3>
              <p className="text-gray-500 text-sm mt-1">฿{product.price_thb}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>ยอดรวมสินค้า (小計)</span>
              <span>฿{product.price_thb}</span>
            </div>
            <div className="flex justify-between">
              <span>ค่าจัดส่ง (配送料)</span>
              <span>฿{shippingFee}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-red-500 pt-3 border-t border-gray-100">
              <span>ยอดชำระสุทธิ (合計)</span>
              <span>฿{totalAmount}</span>
            </div>
          </div>

          {/* ※次回、ここを本物の決済システムに繋ぎます */}
          <button className="w-full bg-[#00B900] text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-green-600 transition-colors">
            ชำระเงินด้วย PromptPay (QR決済へ進む)
          </button>
          
          <div className="mt-4 text-center">
            <Link href={`/products/${product.id}`} className="text-sm text-gray-500 hover:text-gray-800">
              ย้อนกลับ (戻る)
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}