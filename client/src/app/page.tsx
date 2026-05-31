import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HomeContent from "./_components/HomeContent";

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <HomeContent />
            </main>
            <Footer />
        </div>
    );
}
