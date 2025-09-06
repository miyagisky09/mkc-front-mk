import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import { Link, useLocation } from "react-router-dom"
import { IoMdClose } from "react-icons/io";



const Menu = ({
  menu,
  setMenu,
}: {
  menu: boolean
  setMenu: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const path = useLocation()

  const links = [
    { text: "Wallet", link: "/deposit-withdraw" },
    { text: "NFT", link: "/nfts" },
    { text: "Vault", link: "/vaults" },
    { text: "Affiliate", link: "/affiliate" },
    { text: "Concierge", link: "/concierge" }
  ]

  return (
    <AnimatePresence>
      {menu && (
        <div className="w-full min-h-screen fixed top-0 left-0 backdrop-blur-sm z-50 flex justify-end">
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-[#1B1728] flex flex-col p-6 gap-6 w-[275px] z-50 right-0 top-0 relative">
                <button onClick={() => setMenu(false)} className="absolute top-4 right-4">
                    <IoMdClose className="text-[30px] text-white" />
                </button>
                <div className="py-3" />
                {links.map((data) => (
                <Link
                    to={data.link}
                    key={data.text}
                    className={`text-[16px] font-[400] font-btn ${
                    path.pathname === data.link
                        ? "text-[#30B0C7]"
                        : "text-[#FFFFFF]"
                    }`}
                >
                    {data.text}
                </Link>
                ))}
          </motion.div>

          {/* Overlay click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full absolute top-0 left-0"
            onClick={() => setMenu(false)}
          />
        </div>
      )}
    </AnimatePresence>
  )
}

export default Menu
