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

  // --- ESTRATÉGIA BLINDADA: DADOS MOCKADOS (SIMULADOS) ---
  // Sem depender da API do Mercado Livre, o site carrega rápido e nunca dá erro!
  const mockProducts = [
    {
      id: 'MLB1',
      title: 'Smartphone Samsung Galaxy S23 5G 256GB Preto',
      image: 'https://http2.mlstatic.com/D_NQ_NP_600608-MLU72646738912_112023-W.jpg', 
      originalPrice: 4500.00,
      price: 3799.00,
      discount: 15,
      storeName: 'Samsung',
      permalink: 'https://www.mercadolivre.com.br/'
    },
    {
      id: 'MLB2',
      title: 'Smart TV 55 Polegadas 4K UHD LG',
      image: 'https://http2.mlstatic.com/D_NQ_NP_735914-MLU70438316104_072023-W.jpg',
      originalPrice: 3200.00,
      price: 2499.00,
      discount: 21,
      storeName: 'LG Oficial',
      permalink: 'https://www.mercadolivre.com.br/'
    },
    {
      id: 'MLB3',
      title: 'Notebook Ideapad Lenovo AMD Ryzen 5 8GB',
      image: 'https://http2.mlstatic.com/D_NQ_NP_837319-MLU74272199656_012024-W.jpg',
      originalPrice: 2800.00,
      price: 2199.00,
      discount: 21,
      storeName: 'Lenovo',
      permalink: 'https://www.mercadolivre.com.br/'
    },
    {
      id: 'MLB4',
      title: 'Console PlayStation 5 825GB Branco Sony',
      image: 'https://http2.mlstatic.com/D_NQ_NP_841787-MLA44484414455_012021-W.jpg',
      originalPrice: 4499.00,
      price: 3999.00,
      discount: 11,
      storeName: 'PlayStation',
      permalink: 'https://www.mercadolivre.com.br/'
    },
    {
      id: 'MLB5',
      title: 'Fritadeira Air Fryer Mondial 4L Inox',
      image: 'https://http2.mlstatic.com/D_NQ_NP_767576-MLU72700511874_112023-W.jpg',
      originalPrice: 499.00,
      price: 349.00,
      discount: 30,
      storeName: 'Mondial',
      permalink: 'https://www.mercadolivre.com.br/'
    },
    {
      id: 'MLB6',
      title: 'Fone de Ouvido Bluetooth JBL Tune 520BT',
      image: 'https://http2.mlstatic.com/D_NQ_NP_668270-MLU70044574932_062023-W.jpg',
      originalPrice: 299.00,
      price: 219.00,
      discount: 26,
      storeName: 'JBL Oficial',
      permalink: 'https://www.mercadolivre.com.br/'
    }
  ];

  async function fetchProducts() {
    setLoading(true);
    
    // Simulamos um tempo de carregamento de 1 segundo para manter a animação bonitinha
    setTimeout(() => {
      setProducts(mockProducts);
      setCurrentPage(1);
      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

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
                  <p>Nenhum produto encontrado.</p>
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