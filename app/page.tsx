import React from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    return <div className="p-8 text-center text-red-500">データの読み込みに失敗しました</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          สินค้าแม่และเด็กจากญี่ปุ่น 🇯🇵
          <span className="block text-sm font-normal text-gray-500 mt-1">
            (日本のベビー用品ストア)
          </span>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {products?.map((product: any) => (
            <Link 
              href={`/products/${product.id}`} 
              key={product.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt={product.name_th}
                className="w-full h-32 md:h-48 object-cover"
              />
              <div className="p-3 md:p-4 flex flex-col flex-grow">
                <h2 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 leading-tight">
                  {product.name_th}
                </h2>
                <p className="text-xs text-gray-500 mt-1 mb-2 line-clamp-2">
                  {product.desc_th}
                </p>
                <div className="mt-auto pt-2">
                  <p className="text-lg font-extrabold text-red-500 mb-2">
                    ฿{product.price_thb}
                  </p>
                  <div className="w-full bg-[#00B900] text-white py-2 rounded-lg text-xs md:text-sm font-bold shadow-sm flex justify-center items-center gap-1">
                    ดูรายละเอียด (詳細を見る)
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}