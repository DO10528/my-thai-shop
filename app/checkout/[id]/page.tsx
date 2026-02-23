"use client"; // ボタン操作を可能にする魔法の言葉

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function Checkout() {
  const params = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [issubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // フォームの状態管理
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // 商品データの取得
  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  const shippingFee = 50;
  const totalAmount = Number(product.price_thb) + shippingFee;

  // 購入確定ボタンを押した時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน (情報をすべて入力してください)");
      return;
    }

    setIsSubmitting(true);

    // 1. Supabaseの orders テーブルに保存
    const { error } = await supabase
      .from('orders')
      .insert([
        {
          product_id: product.id,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          total_amount: totalAmount,
          status: 'pending'
        }
      ]);

    if (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด (エラーが発生しました)");
      setIsSubmitting(false);
    } else {
      // 2. 成功したらQRコードを表示
      setShowQR(true);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 左側：入力フォーム */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">ข้อมูลการจัดส่ง (配送先情報)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล (氏名)</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B900]" 
                placeholder="สมหญิง รักดี"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ (電話番号)</label>
              <input 
                type="tel" 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B900]" 
                placeholder="0812345678"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่จัดส่ง (住所)</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B900] h-24" 
                placeholder="บ้านเลขที่, ซอย, ถนน..."
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>
          </div>
        </div>

        {/* 右側：確認と支払いボタン */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit text-center">
          {!showQR ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-left">สรุปคำสั่งซื้อ (注文の確認)</h2>
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100 text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image_url} alt={product.name_th} className="w-20 h-20 object-cover rounded-lg" />
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{product.name_th}</h3>
                  <p className="text-gray-500 text-sm">฿{product.price_thb}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600 mb-6 text-left">
                <div className="flex justify-between"><span>小計</span><span>฿{product.price_thb}</span></div>
                <div className="flex justify-between font-bold text-red-500 pt-3 border-t"><span>合計</span><span>฿{totalAmount}</span></div>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={issubmitting}
                className="w-full bg-[#00B900] text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-green-600 disabled:bg-gray-400"
              >
                {issubmitting ? "กำลังบันทึก..." : "ชำระเงินด้วย PromptPay"}
              </button>
            </>
          ) : (
            <div className="py-4">
              <h2 className="text-xl font-bold text-[#00B900] mb-4">สแกนเพื่อชำระเงิน</h2>
              <p className="text-sm text-gray-600 mb-6">PromptPay QR Code</p>
              {/* サンプルのQR画像。後でご自身のQR画像に変更可能です */}
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PROMPTPAY_DATA" 
                alt="QR Code" 
                className="mx-auto mb-6 border-4 border-gray-100 p-2"
              />
              <div className="bg-yellow-50 p-4 rounded-lg text-xs text-gray-700 text-left mb-6">
                <p>1. スキャンしてお支払いください</p>
                <p>2. 支払完了後、LINEで振込証明をお送りください</p>
              </div>
              <Link href="/" className="text-sm text-blue-600 font-bold">← กลับหน้าแรก (トップへ戻る)</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}