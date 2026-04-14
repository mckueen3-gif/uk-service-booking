import AssetManager from "./AssetManager";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function AssetsPage() {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <Link href="/member/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.8rem', transition: 'color 0.2s' }}>
            <ArrowLeft size={14} /> 返回個人資料 (Back to Profile)
          </Link>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            資產管理 (Assets)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            管理您的車輛和物業資訊，加速預約流程。
          </p>
        </div>
      </div>

      <AssetManager />
    </div>
  );
}
