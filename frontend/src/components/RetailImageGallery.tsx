import { ShoppingCart, Store, Package, TrendingUp } from 'lucide-react'

export default function RetailImageGallery() {
  const images = [
    {
      title: "Smart Inventory",
      description: "AI-powered stock management",
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop"
    },
    {
      title: "Retail Analytics",
      description: "Real-time business insights",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
    },
    {
      title: "Store Operations",
      description: "Optimize your retail space",
      icon: Store,
      gradient: "from-emerald-500 to-teal-500",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
    },
    {
      title: "Customer Experience",
      description: "Enhance shopping journey",
      icon: ShoppingCart,
      gradient: "from-orange-500 to-red-500",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {images.map((item, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Image with overlay */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                // Fallback to gradient if image fails to load
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className={`hidden absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Icon */}
            <div className="absolute top-4 right-4">
              <div className={`bg-white/20 backdrop-blur-sm p-2 rounded-lg`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
            <p className="text-sm text-white/80">{item.description}</p>
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300" />
        </div>
      ))}
    </div>
  )
}
