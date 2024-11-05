export default function Footer() {
  return (
    <footer className="border-[#8B4513]">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex space-x-4">
          {/*<button className="text-sm text-[#8B4513] hover:underline">
            Mint
          </button>
          <button className="text-sm text-[#8B4513] hover:underline">
            Upgrade
          </button>
          <button className="text-sm text-[#8B4513] hover:underline">
            Notifications
          </button>*/}
        </div>
        <div className="ml-auto text-lg text--primary-foreground">
          &copy; 2024 Battle of Chains
        </div>
      </div>
    </footer>
  );
}
