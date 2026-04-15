const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  console.log('Seeding SEO Blog Posts...');
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const posts = [
    {
      slug: 'top-5-tips-uk-winter-plumbing',
      title: 'Top 5 Tips for Protecting Your UK Home Plumbing This Winter',
      excerpt: 'Frozen pipes can cause thousands in damage. Learn how to safeguard your home with these essential winter maintenance tips from ConciergeAI experts.',
      category: 'Home Maintenance',
      content: `
        <p>UK winters can be brutal on residential plumbing. As temperatures drop below freezing, the water inside your pipes expands, creating immense pressure that can lead to catastrophic bursts.</p>
        
        <h2>1. Insulate Your Exposed Pipes</h2>
        <p>The most effective way to prevent freezing is to use foam lagging on pipes in unheated areas like attics, garages, and crawl spaces. Specifically, look for high-quality insulation with a wall thickness of at least 19mm.</p>
        
        <h2>2. Keep a Slow Drip During Extreme Cold</h2>
        <p>If you're expecting a deep freeze, letting a faucet drip slightly can prevent pressure buildup. It's not about the moving water as much as it is about providing an escape for pressure if a freeze does occur.</p>
        
        <h2>3. Know Your Stopcock Location</h2>
        <p>Every homeowner should know exactly where their internal stopcock is (usually under the kitchen sink or under the stairs). If a pipe bursts, turning this off immediately is the difference between a small spill and a flooded home.</p>
        
        <h3>Why Verified Professionals Matter</h3>
        <p>While DIY insulation is great, having a <strong>GAS SAFE</strong> or <strong>NICEIC</strong> certified professional inspect your heating and plumbing systems annually is vital for insurance compliance and peace of mind.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
      published: true,
      authorName: 'David Sterling'
    },
    {
      slug: 'hiring-legal-experts-uk-b2b',
      title: 'How to Choose the Right Legal Expert for Your UK Small Business',
      excerpt: 'Navigating B2B contracts and UK employment law can be complex. Here is how to find a verified legal professional who understands your industry.',
      category: 'Legal Advice',
      content: `
        <p>For UK small businesses, legal compliance isn't just a requirement—it's a competitive advantage. From GDPR to employee contracts, the right advice saves you from costly disputes.</p>
        
        <h2>Verify Their Credentials</h2>
        <p>In the UK, ensure your legal advisor is registered with the <strong>Solicitors Regulation Authority (SRA)</strong> or has the appropriate professional indemnity insurance for their specific field.</p>
        
        <h2>Sector-Specific Experience</h2>
        <p>A generalist might handle a simple lease, but if you're in fintech or healthcare, you need someone who understands the specific regulatory frameworks of your niche.</p>
        
        <h3>The ConciergeAI Advantage</h3>
        <p>Our platform pre-screens legal experts to ensure they hold active licenses and have a track record of successful B2B resolution. Don't leave your business protection to chance.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
      published: true,
      authorName: 'Sarah Jenkins'
    },
    {
      slug: 'tax-saving-strategies-self-employed',
      title: '3 Tax-Saving Strategies for Self-Employed Professionals in the UK',
      excerpt: 'Maximize your take-home pay by understanding allowable expenses, pension contributions, and the latest HMRC guidelines.',
      category: 'Accounting',
      content: `
        <h2>1. Claim All Allowable Expenses</h2>
        <p>From office equipment to business travel and even a portion of your home utility bills, ensure you are tracking everything accurately for your Self Assessment.</p>
        
        <h2>2. Use Your ISA Allowance</h2>
        <p>While not a direct business expense, utilizing your £20,000 annual ISA allowance is one of the most tax-efficient ways to grow your personal wealth alongside your business.</p>
        
        <h3>Consult a Pro</h3>
        <p>Tax laws change every budget cycle. Working with a <strong>Chartered Accountant</strong> ensures you never pay more than you owe.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=1200',
      published: true,
      authorName: 'Michael Wong'
    }
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log('Blog seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Note: We need to access pool and prisma from the outer scope if needed, 
    // but usually in a script like this, we just close it inside main or handles it as such.
    // I'll add the cleanup logic inside main's catch/finally if I want, 
    // but I'll update the script to handle cleanup better.
    console.log('Seeding process finished.');
  });
