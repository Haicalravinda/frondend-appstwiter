import { useState, useEffect } from 'react';
import API from './api';
import { useNavigate } from 'react-router-dom';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);
  const [followId, setFollowId] = useState('');
  const [message, setMessage] = useState('');
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('foryou');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [retweetedPosts, setRetweetedPosts] = useState(new Set());
  const navigate = useNavigate();

 
  const trendingTopics = [
    { topic: 'Teknologi · Trending', title: '#ReactJS', tweets: '25.4K' },
    { topic: 'Indonesia · Trending', title: 'Haical Ravinda Rassya', tweets: '12K' },
    { topic: 'Coding', title: 'Tailwind CSS', tweets: '50K' },
    { topic: 'Olahraga', title: 'Timnas', tweets: '100K' },
  ];

  useEffect(() => {
    fetchFeed();
  }, [page]);

  const fetchFeed = async () => {
    try {
      const res = await API.get(`/feed?page=${page}&limit=5`);
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Gagal ambil feed", err);
      
      if(posts.length === 0) {
         // Remove this block in production
      }
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (content.length > 200) return;
    try {
      await API.post('/posts', { content });
      setContent('');
      fetchFeed();
      setMessage('Tweet terkirim');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || "Gagal posting");
    }
  };

  const handleFollow = async () => {
    if (!followId) return;
    try {
      await API.post(`/follow/${followId}`);
      setMessage(`Mengikuti user ID: ${followId}`);
      setTimeout(() => setMessage(''), 3000);
      setFollowId('');
      setShowFollowModal(false);
      fetchFeed();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal follow");
    }
  };

  const handleUnfollow = async (targetId) => {
    if (!confirm("Yakin mau unfollow?")) return;
    try {
      await API.delete(`/follow/${targetId}`);
      fetchFeed();
    } catch (err) {
      alert("Gagal unfollow");
    }
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const handleRetweet = (postId) => {
    setRetweetedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const handleLogout = () => {
    if (confirm("Keluar dari akun?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const username = localStorage.getItem('username') || 'Guest';
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex justify-center">
      
    
      <header className="hidden md:flex flex-col w-[88px] xl:w-[275px] h-screen sticky top-0 px-2 xl:px-6 border-r border-gray-100 overflow-y-auto z-20">
       
        <div className="py-4 px-2">
          <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-blue-50 transition cursor-pointer">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 text-[#1D9BF0] fill-current">
              <g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g>
            </svg>
          </div>
        </div>

    
        <nav className="mt-2 space-y-1 mb-4">
          <NavItem icon={<HomeIcon active />} text="Beranda" active />
          <NavItem icon={<SearchIcon />} text="Jelajahi" />
          <NavItem icon={<BellIcon />} text="Notifikasi" />
          <NavItem icon={<MailIcon />} text="Pesan" />
          <NavItem icon={<UserIcon />} text="Profil" />
          <NavItem icon={<DotsCircleHorizontalIcon />} text="Lainnya" />
        </nav>

     
        <button className="w-full bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold py-3 rounded-full shadow-md transition duration-200 hidden xl:block">
          Posting
        </button>
        <div className="xl:hidden flex justify-center">
            <div className="w-12 h-12 bg-[#1D9BF0] rounded-full flex items-center justify-center text-white">
                <FeatherIcon />
            </div>
        </div>

    
        <div className="mt-auto mb-6 flex items-center justify-between p-3 rounded-full hover:bg-gray-100 transition cursor-pointer" onClick={handleLogout}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              {userInitial}
            </div>
            <div className="hidden xl:block leading-tight">
              <div className="font-bold text-sm">{username}</div>
              <div className="text-gray-500 text-sm">@{username.toLowerCase()}</div>
            </div>
          </div>
          <div className="hidden xl:block">
             <DotsHorizontalIcon />
          </div>
        </div>
      </header>

    
      <main className="flex-1 max-w-[600px] w-full border-r border-gray-100 min-h-screen relative">
        
  
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <h2 className="px-4 py-3 text-xl font-bold text-gray-900 hidden md:block">Beranda</h2>
            <div className="flex">
              <div 
                onClick={() => setActiveTab('foryou')}
                className="flex-1 h-[53px] flex items-center justify-center hover:bg-gray-100 transition cursor-pointer relative"
              >
                <div className={`h-full flex items-center font-medium ${activeTab === 'foryou' ? 'text-black font-bold' : 'text-gray-500'}`}>
                  Untuk Anda
                  {activeTab === 'foryou' && <div className="absolute bottom-0 h-[4px] w-[70px] bg-[#1D9BF0] rounded-full"></div>}
                </div>
              </div>
              <div 
                onClick={() => setActiveTab('following')}
                className="flex-1 h-[53px] flex items-center justify-center hover:bg-gray-100 transition cursor-pointer relative"
              >
                 <div className={`h-full flex items-center font-medium ${activeTab === 'following' ? 'text-black font-bold' : 'text-gray-500'}`}>
                  Mengikuti
                  {activeTab === 'following' && <div className="absolute bottom-0 h-[4px] w-[76px] bg-[#1D9BF0] rounded-full"></div>}
                </div>
              </div>
            </div>
        </div>

       
        <div className="border-b border-gray-100 p-4 flex space-x-4">
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                   {userInitial}
                </div>
            </div>
            <div className="flex-1">
                <form onSubmit={handlePost}>
                    <textarea 
                        className="w-full text-xl placeholder-gray-500 text-gray-900 border-none focus:ring-0 resize-none p-2 min-h-[50px] outline-none"
                        placeholder="Apa yang sedang terjadi?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="2"
                    />
                    {content && (
                        <div className="border-b border-gray-100 mb-2"></div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex space-x-2 text-[#1D9BF0]">
                            <IconButton><ImageIcon /></IconButton>
                            <IconButton><GifIcon /></IconButton>
                            <IconButton><PollIcon /></IconButton>
                            <IconButton><EmojiIcon /></IconButton>
                            <IconButton><CalendarIcon /></IconButton>
                        </div>
                        <div className="flex items-center space-x-3">
                           {content.length > 0 && (
                             <div className="flex items-center">
                               <span className={`text-xs font-bold mr-2 ${content.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                                 {content.length}/200
                               </span>
                               <div className="w-5 h-5 rounded-full border-2 border-gray-200" style={{ background: `conic-gradient(#1D9BF0 ${(content.length/200)*360}deg, transparent 0)`}}></div>
                             </div>
                           )}
                           <button 
                             disabled={!content.trim() || content.length > 200}
                             className="bg-[#1D9BF0] hover:bg-[#1A8CD8] disabled:opacity-50 text-white font-bold px-5 py-1.5 rounded-full transition"
                           >
                             Posting
                           </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

      
        {message && (
           <div className="bg-[#1D9BF0] text-white px-4 py-2 text-center text-sm font-medium sticky top-14 z-20 transition-all">
               {message}
           </div>
        )}

    
        <div className="pb-20">
            {posts.length === 0 ? (
                <div className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Selamat datang di Beranda!</h3>
                    <p className="text-gray-500 mb-6">Ini adalah tempat terbaik untuk melihat apa yang sedang terjadi di dunia. Cari orang dan topik untuk diikuti sekarang.</p>
                    <button onClick={() => setShowFollowModal(true)} className="bg-[#1D9BF0] text-white font-bold px-6 py-3 rounded-full">
                        Ayo Mulai!
                    </button>
                </div>
            ) : (
                posts.map((post) => (
                    <article key={post.id} className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50/50 transition cursor-pointer flex space-x-3">
                        <div className="flex-shrink-0">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                                {post.user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1 truncate">
                                    <span className="font-bold text-gray-900 hover:underline">{post.user?.username || `User ${post.userId}`}</span>
                                    <VerifiedBadge />
                                    <span className="text-gray-500 text-sm">@{post.user?.username?.toLowerCase() || `user${post.userId}`}</span>
                                    <span className="text-gray-500 text-sm">·</span>
                                    <span className="text-gray-500 text-sm hover:underline">{Math.floor(Math.random() * 24)}j</span>
                                </div>
                                <div className="group relative">
                                    <button className="text-gray-400 hover:bg-blue-50 hover:text-[#1D9BF0] p-2 rounded-full transition" onClick={(e) => {e.stopPropagation(); handleUnfollow(post.userId)}}>
                                       <DotsHorizontalIcon size={18} />
                                    </button>
                                </div>
                            </div>

                         
                            <p className="text-gray-900 text-[15px] leading-normal whitespace-pre-wrap mb-3">
                                {post.content}
                            </p>

                          
                            <div className="flex justify-between max-w-[425px] text-gray-500">
                                <PostAction 
                                  icon={<ChatIcon />} 
                                  count={Math.floor(Math.random() * 20)} 
                                  color="blue"
                                />
                                <PostAction 
                                  active={retweetedPosts.has(post.id)}
                                  onClick={() => handleRetweet(post.id)}
                                  icon={<RetweetIcon />} 
                                  count={Math.floor(Math.random() * 50) + (retweetedPosts.has(post.id) ? 1 : 0)} 
                                  color="green"
                                />
                                <PostAction 
                                  active={likedPosts.has(post.id)}
                                  onClick={() => handleLike(post.id)}
                                  icon={likedPosts.has(post.id) ? <HeartIconFilled /> : <HeartIcon />} 
                                  count={Math.floor(Math.random() * 200) + (likedPosts.has(post.id) ? 1 : 0)} 
                                  color="pink"
                                />
                                <PostAction 
                                  icon={<ShareIcon />} 
                                  color="blue"
                                />
                            </div>
                        </div>
                    </article>
                ))
            )}
            
       
            {posts.length > 0 && (
                <div className="p-4 flex justify-center border-t border-gray-100">
                     <button onClick={() => setPage(p=>p+1)} className="text-[#1D9BF0] text-sm hover:bg-blue-50 px-4 py-2 rounded-full transition">
                        Muat lainnya
                     </button>
                </div>
            )}
        </div>

      </main>

    
      <aside className="hidden lg:block w-[350px] pl-8 py-3 h-screen sticky top-0 overflow-y-auto">
          
     
          <div className="sticky top-0 bg-white pb-3 z-10">
              <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#1D9BF0]">
                      <SearchIcon size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Cari" 
                    className="w-full bg-gray-100 border-transparent focus:border-[#1D9BF0] focus:bg-white focus:ring-1 focus:ring-[#1D9BF0] rounded-full py-2.5 pl-12 pr-4 text-sm transition outline-none placeholder-gray-500"
                  />
              </div>
          </div>

      
          <div className="bg-gray-50/80 rounded-2xl mb-4 border border-gray-100">
             <h3 className="font-extrabold text-xl px-4 py-3 text-gray-900">Tren untuk Anda</h3>
             {trendingTopics.map((item, idx) => (
                 <div key={idx} className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition relative">
                     <div className="flex justify-between text-gray-500 text-xs mb-0.5">
                         <span>{item.topic}</span>
                         <DotsHorizontalIcon size={14}/>
                     </div>
                     <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                     <div className="text-gray-500 text-xs mt-0.5">{item.tweets} Posting</div>
                 </div>
             ))}
             <div className="px-4 py-3 text-[#1D9BF0] text-sm hover:bg-gray-100 rounded-b-2xl cursor-pointer transition">
                 Tampilkan lebih banyak
             </div>
          </div>

     
          <div className="bg-gray-50/80 rounded-2xl border border-gray-100">
              <h3 className="font-extrabold text-xl px-4 py-3 text-gray-900">Siapa yang harus diikuti</h3>
              {[1, 2, 3].map((id) => (
                  <div key={id} className="px-4 py-3 hover:bg-gray-100 transition flex items-center justify-between cursor-pointer">
                      <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                          <div>
                              <div className="font-bold text-sm text-gray-900 hover:underline">User {id}</div>
                              <div className="text-gray-500 text-xs">@user{id}</div>
                          </div>
                      </div>
                      <button className="bg-black hover:bg-gray-800 text-white text-sm font-bold px-4 py-1.5 rounded-full transition">
                          Ikuti
                      </button>
                  </div>
              ))}
               <div 
                  onClick={() => setShowFollowModal(true)}
                  className="px-4 py-3 text-[#1D9BF0] text-sm hover:bg-gray-100 rounded-b-2xl cursor-pointer transition"
               >
                 Tampilkan lebih banyak
             </div>
          </div>

          <div className="mt-4 px-4 text-xs text-gray-500 leading-relaxed">
              <span className="hover:underline cursor-pointer mr-2">Persyaratan Layanan</span>
              <span className="hover:underline cursor-pointer mr-2">Kebijakan Privasi</span>
              <span className="hover:underline cursor-pointer mr-2">Kebijakan Cookie</span>
              <span>© 2025 Haical Corp.</span>
          </div>

      </aside>

    
      {showFollowModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowFollowModal(false)}>
            <div className="bg-white rounded-2xl w-full max-w-[600px] min-h-[400px] flex flex-col relative" onClick={e => e.stopPropagation()}>
                <div className="flex items-center px-4 h-[53px]">
                    <button onClick={() => setShowFollowModal(false)} className="hover:bg-gray-100 rounded-full p-2 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div className="ml-8 font-bold text-xl">Ikuti Pengguna</div>
                </div>
                <div className="p-12 flex flex-col items-center justify-center flex-1">
                     <div className="w-full max-w-xs">
                        <label className="block text-sm font-bold mb-2">ID Pengguna</label>
                        <input 
                           type="number" 
                           value={followId}
                           onChange={e => setFollowId(e.target.value)}
                           className="w-full border border-gray-300 rounded p-3 focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0] outline-none transition mb-4"
                           placeholder="Masukkan ID..."
                        />
                        <button 
                          onClick={handleFollow}
                          disabled={!followId}
                          className="w-full bg-black text-white font-bold py-3 rounded-full disabled:opacity-50 hover:bg-gray-900 transition"
                        >
                            Ikuti
                        </button>
                     </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}



function NavItem({ icon, text, active }) {
  return (
    <div className="group flex items-center xl:space-x-4 p-3 w-fit rounded-full hover:bg-gray-100 transition cursor-pointer">
       <div className="text-gray-900 relative">
         {icon}
         {active && <div className="absolute top-0 right-0 w-2 h-2 bg-[#1D9BF0] rounded-full xl:hidden"></div>}
       </div>
       <span className={`hidden xl:block text-xl mr-4 ${active ? 'font-bold' : 'font-normal'}`}>{text}</span>
    </div>
  );
}

function PostAction({ icon, count, color, active, onClick }) {
  const colorClasses = {
    blue: 'group-hover:text-[#1D9BF0] group-hover:bg-blue-50',
    green: 'group-hover:text-green-500 group-hover:bg-green-50',
    pink: 'group-hover:text-pink-500 group-hover:bg-pink-50',
  };

  const textClass = active 
     ? (color === 'green' ? 'text-green-500' : color === 'pink' ? 'text-pink-500' : 'text-[#1D9BF0]') 
     : '';

  return (
    <div className={`flex items-center group cursor-pointer transition ${textClass}`} onClick={(e) => {e.stopPropagation(); onClick && onClick()}}>
        <div className={`p-2 rounded-full transition ${colorClasses[color].split(' ')[1]}`}>
            {icon}
        </div>
        {count !== undefined && (
            <span className={`text-xs ml-1 ${colorClasses[color].split(' ')[0]}`}>{count > 0 ? count : ''}</span>
        )}
    </div>
  );
}

function IconButton({ children }) {
  return (
    <div className="p-2 rounded-full hover:bg-blue-50 cursor-pointer transition text-[#1D9BF0]">
      {children}
    </div>
  )
}


const HomeIcon = ({active}) => active ? <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor"><g><path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.815-.44L4.7 19.963c.214 1.215 1.308 2.062 2.658 2.062h9.282c1.352 0 2.445-.848 2.663-2.087l1.626-11.49.818.442c.364.193.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 12.133c-.108.62-.66.915-1.095.915H7.356c-.437 0-.987-.302-1.087-.88l-1.582-11.19 7.25-3.915 7.372 3.98-1.49 11.09z"></path><path d="M12 8.718c-1.815 0-3.29 1.485-3.29 3.31 0 1.824 1.475 3.31 3.29 3.31s3.29-1.486 3.29-3.31c0-1.825-1.475-3.31-3.29-3.31zm0 4.62c-.713 0-1.29-.587-1.29-1.31 0-.722.577-1.31 1.29-1.31s1.29.588 1.29 1.31c0 .723-.577 1.31-1.29 1.31z"></path></g></svg> : null;
const SearchIcon = ({size=26}) => <svg className={`w-${size === 26 ? '7' : '4'} h-${size === 26 ? '7' : '4'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;
const BellIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>;
const MailIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const UserIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;
const DotsCircleHorizontalIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const FeatherIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>;
const DotsHorizontalIcon = ({size=20}) => <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M6 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>;
const ChatIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>;
const RetweetIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
const HeartIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>;
const HeartIconFilled = () => <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
const ShareIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>;
const ImageIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><g><path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 11.48l3.318-3.318 2.047 2.037c.142.14.332.217.53.217h.002c.2 0 .388-.078.53-.218l4.318-4.385 4.494 4.494v6.926c0 .413-.337.75-.75.75H4.25c-.413 0-.75-.337-.75-.75v-5.752zM8 7.25c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 4.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z"></path></g></svg>;
const GifIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><g><path d="M3 4.25C3 3.01 4.01 2 5.25 2h13.5C19.99 2 21 3.01 21 4.25v15.5c0 1.24-1.01 2.25-2.25 2.25H5.25C4.01 22 3 20.99 3 19.75V4.25zm1.5 0v15.5c0 .413.337.75.75.75h13.5c.413 0 .75-.337.75-.75V4.25c0-.413-.337-.75-.75-.75H5.25c-.413 0-.75.337-.75.75zM12 8h-2.5c-.828 0-1.5.672-1.5 1.5v5c0 .828.672 1.5 1.5 1.5h2.5c.828 0 1.5-.672 1.5-1.5v-1.5h-2v1.5h2v-3h-2v1.5h2v-3h-2v-1.5h2.5V8zM7 16V8H5.5v8H7zm11.5-4v-4H14v8h4.5v-1.5h-3v-1h2.5v-1.5h-2.5z"></path></g></svg>;
const PollIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><g><path d="M3 4.25C3 3.01 4.01 2 5.25 2h13.5C19.99 2 21 3.01 21 4.25v15.5c0 1.24-1.01 2.25-2.25 2.25H5.25C4.01 22 3 20.99 3 19.75V4.25zm1.5 0v15.5c0 .413.337.75.75.75h13.5c.413 0 .75-.337.75-.75V4.25c0-.413-.337-.75-.75-.75H5.25c-.413 0-.75.337-.75.75zM6 16.25c0 .414.336.75.75.75h4.5c.414 0 .75-.336.75-.75v-3.5c0-.414-.336-.75-.75-.75h-4.5c-.414 0-.75.336-.75.75v3.5zm1.5-2.25h3v1h-3v-1zm5.25 2.25c0 .414.336.75.75.75h4.5c.414 0 .75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75h-4.5c-.414 0-.75.336-.75.75v8.5zm1.5-7.25h3v6h-3V9z"></path></g></svg>;
const EmojiIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><g><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-1.5c4.694 0 8.5-3.806 8.5-8.5S16.694 3.5 12 3.5 3.5 7.306 3.5 12s3.806 8.5 8.5 8.5zm-3.5-8c-.828 0-1.5-.672-1.5-1.5S7.672 9.5 8.5 9.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm8.485 4.95l-1.06 1.06C14.905 17.53 13.537 18 12 18s-2.904-.47-3.924-1.49l-1.06-1.06 1.06-1.06c.717.72 1.672 1.11 2.864 1.11s2.147-.39 2.864-1.11l1.06 1.06zm-1.485-3.45c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z"></path></g></svg>;
const CalendarIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><g><path d="M19.75 4H18V2h-1.5v2h-9V2H6v2H4.25C3.01 4 2 5.01 2 6.25v13.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V6.25C22 5.01 20.99 4 19.75 4zM4.25 5.5h1.75v2h1.5v-2h9v2h1.5v-2h1.75c.413 0 .75.337.75.75V10H3.5V6.25c0-.413.337-.75.75-.75zM3.5 19.75V11.5h17v8.25c0 .413-.337.75-.75.75H4.25c-.413 0-.75-.337-.75-.75z"></path></g></svg>;
const VerifiedBadge = () => <svg viewBox="0 0 24 24" aria-label="Akun terverifikasi" className="w-5 h-5 text-[#1D9BF0] fill-current ml-0.5"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>;

export default Feed;