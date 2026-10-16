import { Switch, Route, Router as WouterRouter } from "wouter";
import NotFound from "@/pages/not-found";
import { Hero } from "@/components/hero";
import { Statement } from "@/components/statement";
import { Services } from "@/components/services";
import { Work } from "@/components/work";
import { Gallery } from "@/components/gallery";
import { Reviews } from "@/components/reviews";
import { Plans } from "@/components/plans";
import { Contact, Footer, Manifesto } from "@/components/closing";

function Home() {
  return (
    <div className="min-h-screen w-full bg-background overflow-x-clip selection:bg-primary selection:text-white">
      <Hero />
      <Statement />
      <Services />
      <Work />
      <Gallery />
      <Reviews />
      <Plans />
      <Contact />
      <Manifesto />
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
