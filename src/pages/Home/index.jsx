import { useState, useEffect } from 'react'; 
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';
import { Banner } from '../../components/Banner'; 
import { TrustPanel } from '../../components/TrustPanel'; 
import { SecuritySymbolsPanel } from '../../components/SecuritySymbolsPanel'; 
import { GuaranteePanel } from '../../components/GuaranteePanel'; 
import { MoneyBackPanel } from '../../components/MoneyBackPanel'; 
import { FilterBar } from '../../components/FilterBar';
import { PaginationBar } from '../../components/PaginationBar'; 
import styles from './css/Home.module.css';

export function Home() {
  
  const [itemsPerPage, setItemsPerPage] = useState(12); 
  const [currentPage, setCurrentPage] = useState(1);   
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 

  // --- ESTRATÉGIA: CURADORIA PREMIUM (VIA BACKEND SEGURO) ---
  async function fetchProducts() {
    setLoading(true);
    try {
      console.log("🔍 Solicitando Curadoria VIP ao servidor...");

      // Chamamos a nossa própria API segura da Vercel
      const response = await fetch('/api/items');
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      
      // --- ALTERAÇÃO DE SEGURANÇA (Anti-Tela Branca) ---
      // Verificamos se 'data' é realmente um Array antes de tentar usar o .map()
      if (data && Array.isArray(data) && data.length > 0) {
        const formattedProducts = data.map(item => {
          const produto = item.body;
          
          // Se o Mercado Livre não devolver o corpo do produto, ignoramos esse item
          if (!produto || !produto.id) return null;

          return {
            id: produto.id,
            title: produto.title,
            image: produto.thumbnail ? produto.thumbnail.replace(/\w\.jpg/g, 'W.jpg') : '', 
            originalPrice: produto.original_price,
            price: produto.price,
            discount: produto.original_price ? Math.round(((produto.original_price - produto.price) / produto.original_price) * 100) : null,
            storeName: "Loja Oficial",
            permalink: produto.permalink
          };
        }).filter(Boolean); // Remove os itens que retornaram null

        setProducts(formattedProducts);
      } else {
        console.warn("⚠️ A API não retornou uma lista de produtos válida.");
        setProducts([]); 
      }

    } catch (error) {
      console.error("❌ Erro crítico ao carregar vitrine:", error);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Lógica de Paginação (Protegida contra valores negativos ou nulos)
  const indexOfLastProduct = Math.max(currentPage * itemsPerPage, 0);
  const indexOfFirstProduct = Math.max(indexOfLastProduct - itemsPerPage, 0);
  const displayedProducts = Array.isArray(products) ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

  const totalPages = itemsPerPage > 0 ? Math.ceil(products.length / itemsPerPage) : 0;

  return (
    <div className={styles.pageContainer}>
      <Header onSearch={() => {}} />

      <Banner />

      <main className={styles.contentWrapper}>
        
        <aside className={styles.sideColumn}>
          <FilterBar />
        </aside>

        <div className={styles.middleColumn}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#666' }}>
              <p>Carregando as melhores ofertas do dia...</p>
            </div>
          ) : (
            <section className={styles.productsGrid}>
              {displayedProducts.length > 0 ? (
                displayedProducts.map(produto => (
                  <ProductCard key={produto.id} {...produto} />
                ))
              ) : (
                <div style={{ textAlign: 'center', gridColumn: 'span 3', padding: '20px' }}>
                  <p>Nenhum produto encontrado. Verifique a conexão com o servidor.</p>
                </div>
              )}
            </section>
          )}

          <PaginationBar 
            itemsPerPage={itemsPerPage} 
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>

        <aside className={styles.securityColumn}>
          <TrustPanel />
          <SecuritySymbolsPanel />
          <GuaranteePanel />
          <MoneyBackPanel />
        </aside>

        <div className={styles.separatorLine}></div>

        <aside className={styles.adColumn}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', minHeight: '300px' }}>
            <h3>Espaço AdSense</h3>
          </div>
        </aside>

      </main>

      <div className={styles.stickyFooterAd}>
        <div className={styles.stickyAdContent}>
          Anúncio AdSense (728x90)
        </div>
      </div>
    </div>
  );
}