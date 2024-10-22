"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { fal } from "@fal-ai/client"
import confetti from 'canvas-confetti'
import { ArrowLeft, Baby, Loader2, MapPin, ShoppingBag, Wand2 } from "lucide-react"

fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_API_KEY,
})

const costumeIdeas = [
  { name: "Friendly dinosaur", emoji: "🦖" },
  { name: "Cute puppy", emoji: "🐶" },
  { name: "Colorful butterfly", emoji: "🦋" },
  { name: "Brave firefighter", emoji: "🚒" },
  { name: "Magical unicorn", emoji: "🦄" },
  { name: "Playful kitten", emoji: "🐱" },
  { name: "Superhero", emoji: "🦸" },
  { name: "Fairy princess", emoji: "👸" },
  { name: "Astronaut", emoji: "👨‍🚀" },
  { name: "Pirate", emoji: "🏴‍☠️" }
]

const costumeShops = [
  { name: "KidsCostumesOnline", url: "https://www.kidscostumesonline.com", type: "online" },
  { name: "Party City", location: "123 Main St, Anytown, USA", type: "store" },
  { name: "Amazon Halloween Store", url: "https://www.amazon.com/halloween", type: "online" },
  { name: "Spirit Halloween", location: "456 Oak Ave, Somewhere, USA", type: "store" },
]

const exampleCostumes = [
  {
    name: "Little Mermaid",
    image: "https://cdn.midjourney.com/70c0e667-3917-4aac-b715-aa63afe1fb94/0_0.png",
    prompt: "A cute and friendly little mermaid costume for a child aged 2-5. Shimmering tail, seashell top, and a small tiara.",
    shops: [
      { name: "Disney Store", url: "https://www.shopdisney.com", type: "online" },
      { name: "Costume World", location: "789 Beach Blvd, Seaside, USA", type: "store" },
    ]
  },
  {
    name: "Tiny Astronaut",
    image: "https://cdn.midjourney.com/bb56f8fa-0adc-4227-b7bf-2b9bb75b8cb4/0_3.png",
    prompt: "An adorable astronaut costume for a toddler. White spacesuit with NASA patches, small helmet, and moon boots.",
    shops: [
      { name: "Space Costumes R Us", url: "https://www.spacecostumes.com", type: "online" },
      { name: "Stellar Outfitters", location: "101 Galaxy Lane, Starville, USA", type: "store" },
    ]
  },
  {
    name: "Baby Dragon",
    image: "https://cdn.midjourney.com/e9d0efeb-d65d-46ea-a6de-dc75267ce39b/0_1.png",
    prompt: "A cuddly baby dragon costume for a young child. Soft scales, small wings, and a cute tail.",
    shops: [
      { name: "Fantasy Costume Emporium", url: "https://www.fantasycostumes.com", type: "online" },
      { name: "Dragon's Lair Outfitters", location: "222 Castle Road, Fairytale City, USA", type: "store" },
    ]
  },
  {
    name: "Mini Chef",
    image: "https://cdn.midjourney.com/d3a4b594-4812-451c-84a4-3a239b42e005/0_0.png",
    prompt: "An adorable chef costume for a small child. White chef's hat, miniature apron, and a wooden spoon accessory.",
    shops: [
      { name: "Little Cook's Corner", url: "https://www.littlecookscorner.com", type: "online" },
      { name: "Culinary Costumes", location: "333 Gourmet Ave, Tasteville, USA", type: "store" },
    ]
  },
]

export default function CostumeGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<typeof costumeShops>([])
  const [showLanding, setShowLanding] = useState(true)

  useEffect(() => {
    if (generatedImage) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [generatedImage])

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)
    setRecommendations([])
  
    try {
      const result = await fal.subscribe("fal-ai/fast-sdxl", {
        input: {
          prompt: `Cute and friendly Halloween costume for a young child (age 2-5): ${prompt}. Colorful, safe, and age-appropriate.`,
          negative_prompt: "scary, spooky, dangerous, inappropriate, mature content, violent",
          num_inference_steps: 30,
          safety_checker: true,
          seed: Math.floor(Math.random() * 1000000),
        },
        pollInterval: 1000, // Poll every second
        onQueueUpdate: (update) => {
          console.log("Queue update:", update)
        },
      })
  
      console.log('API result:', result);
  
      if (result && result.data && result.data.images && result.data.images.length > 0) {
        const imageUrl = result.data.images[0].url;
        setGeneratedImage(imageUrl);
        setRecommendations(costumeShops.sort(() => 0.5 - Math.random()).slice(0, 3));
      } else {
        throw new Error("No image URL found in the result");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError("Oops! The costume fairy is taking a nap. Let's try again! 🧚‍♂️💤");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="container mx-auto px-2 sm:px-4 max-w-3xl bg-gray-50 min-h-screen font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-repeat bg-[length:20px_20px] animate-move-bg" 
             style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
      </div>
      <div className="relative z-10">
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
        }
        @keyframes move-bg {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
        .animate-move-bg {
          animation: move-bg 10s linear infinite;
        }
      `}</style>
      <nav className="mb-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowLanding(true)}
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Baby  width={120} height={120}/>
          <span className="sr-only">Home</span>
        </Button>
        {!showLanding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLanding(true)}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        )}
      </nav>
      {showLanding ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-indigo-600 animate-bounce">
            🎃 Spooktacular Costume Creator 🎃
          </h1>
          <Card className="mb-6 border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-indigo-600">Welcome, Little Monsters!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-lg">
                Get ready for a magical Halloween adventure! Our Costume Creator will help you find the perfect costume for trick-or-treating. Let's make some spooky magic together! 🧙‍♂️✨
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {exampleCostumes.map((costume, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="text-center cursor-pointer transition-transform hover:scale-105">
                        <img src={costume.image} alt={costume.name} className="mx-auto rounded-lg shadow-md" />
                        <p className="mt-2 font-semibold">{costume.name}</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{costume.name}</DialogTitle>
                        <DialogDescription>Costume Details</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <img src={costume.image} alt={costume.name} className="w-full rounded-lg shadow-md" />
                        <p className="text-sm text-gray-500">{costume.prompt}</p>
                        <div>
                          <h4 className="mb-2 font-semibold">Where to find:</h4>
                          <ul className="space-y-2">
                            {costume.shops.map((shop, shopIndex) => (
                              <li key={shopIndex} className="flex items-center space-x-2 text-sm">
                                {shop.type === 'online' ? <ShoppingBag className="h-4 w-4 text-blue-500" /> : <MapPin className="h-4 w-4 text-red-500" />}
                                <span>{shop.name}</span>
                                {shop.url ? (
                                  <a href={shop.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Visit</a>
                                ) : (
                                  <span className="text-gray-600">{shop.location}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
              <Button 
                onClick={() => setShowLanding(false)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xl py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <Wand2 className="mr-2" /> Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center text-gray-800 relative">
            <span className="relative inline-block">
              🎃 Spooktacular Costume Creator 🎃
              <span className="absolute inset-0 bg-orange-200 opacity-25 blur-md -z-10"></span>
            </span>
          </h1>
          <Card className="mb-4 border border-gray-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl sm:text-2xl text-center text-indigo-600">Magical Costume Generator</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex space-x-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter a costume idea"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  className="border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading || !prompt}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Casting spell...
                    </>
                  ) : (
                    <>Create Magic ✨</>
                  )}
                </Button>
              </div>
              {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
              {generatedImage && (
                <div className="mt-4 text-center">
                  <img src={generatedImage} alt="Generated costume" className="mx-auto rounded-lg shadow-lg border-4 border-purple-300" />
                  <p className="mt-2 text-lg text-purple-600 font-semibold">Ta-da! Your magical costume is ready! 🎉</p>
                </div>
              )}
            </CardContent>
          </Card>
          {recommendations.length > 0 && (
            <Card className="mb-6 border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-indigo-600">Where to Find Your Costume 🔍</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.map((shop, index) => (
                    <li key={index} className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow">
                      {shop.type === 'online' ? <ShoppingBag className="text-blue-500" /> : <MapPin className="text-red-500" />}
                      <span className="font-semibold">{shop.name}</span>
                      {shop.url ? (
                        <a href={shop.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Visit Store</a>
                      ) : (
                        <span className="text-gray-600">{shop.location}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          <Card className="border border-gray-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl sm:text-2xl text-center text-indigo-600">Costume Ideas for Little Monsters 👻</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {costumeIdeas.map((idea, index) => (
                  <li key={index}>
                    <Button 
                      variant="outline" 
                      className="w-full border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base py-1 sm:py-2"
                      onClick={() => setPrompt(idea.name)}
                    >
                      {idea.emoji} {idea.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
      </div>
    </div>
  )
}