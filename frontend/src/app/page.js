import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div
        className="min-h-screen w-full bg-cover bg-center"
        style={{
          backgroundImage: "url(images/home1.png)",
        }}
      >
        <div className="flex justify-between items-center p-3 max-w-3xl mx-auto text-white">
          <div className="font-alex font-medium text-3xl text-[#977108]">Lyaim</div>
          <div className="flex gap-5 text-lg">
            <Link href={'register'}>REGISTRATION</Link>
            <Link href={'login'}>LOGIN</Link>
          </div>
        </div>

        <div className="mt-10 w-2/3 left-1/3 absolute text-white space-y-10">
          <div className="text-center font-acme space-y-5">
            <h1 className="text-3xl font-semibold font-abril">
              KICK OFF YOUR FANTASY JOURNEY!!!
            </h1>
            <p className="text-2xl font-semibold">Build you dream team,</p>
            <p className="text-2xl font-semibold">Dominate the field,</p>
            <p className="text-2xl font-semibold">And win big! 🤑</p>
          </div>

          <div className="text-center space-y-5">
            <p className="text-3xl text-red-950 font-bold font-Agbalumo">
              SO, WHAT ARE YOU WAITING FOR???
            </p>
            <button
              style={{
                background: 'linear-gradient(150deg, #5672B8, #040B29DB)',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              }}
              className="w-fit px-5 py-1 rounded-2xl text-[#93EEE3] text-lg font-semibold hover:bg-[#93EEF9] transition"
            >
              JOIN NOW
            </button>
          </div>
        </div>
      </div>

      <div
        className="min-h-screen w-full bg-cover bg-center"
        style={{
          backgroundImage: "url(images/home2.png)",
        }}
      >
        <div className="text-center space-y-5 p-10">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-semibold font-abril">
            EASY TO START, HARD TO FORGET
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-agbalumo w-2/3 text-center mx-auto">Choose your league, build your dream team, and claim the glory with epic prizes waiting to be won! 🏆⚽🎉</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-around items-center gap-8 text-2xl lg:text-xl text-white font-bold font-acme p-4">
          <div className="space-y-2 text-center">
            <Image
              width={150}
              height={150}
              src={'/images/contest.png'}
              alt='Contest'
            />
            <button className="py-2 w-full text-[#5672B8] sm:text-white sm:bg-[#3C645F80] rounded-md sm:hover:bg-[#3C645FBF]">
              Contest
            </button>
          </div>

          <div className="space-y-2 text-center">
            <Image
              width={150}
              height={150}
              src={'/images/club1.png'}
              alt='Choose Team'
            />
            <button className="py-2 w-full text-[#9C1919] sm:text-white sm:bg-[#3C645F80] rounded-md sm:hover:bg-[#3C645FBF]">
              Choose Team
            </button>
          </div>

          <div className="space-y-2 text-center">
            <Image
              width={150}
              height={150}
              src={'/images/trophy1.png'}
              alt='Leaderboard'
              className="rounded-full"
            />
            <button className="py-2 w-full text-[#56C35E] sm:text-white sm:bg-[#3C645F80] rounded-md sm:hover:bg-[#3C645FBF]">
              Leaderboard
            </button>
          </div>
        </div>
      </div>

      <div
        className="min-h-screen w-full bg-cover bg-center"
        style={{
          backgroundImage: "url(images/home3.png)",
        }}
      >
        <div className="text-center p-10">
          <h1 className="text-3xl text-white sm:text-3xl md:text-4xl font-medium font-abril">
            FANTASY GAME FOR ALL
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:justify-around items-center gap-1 md:gap-8 text-lg md:text-xl lg:text-2xl text-black md:text-center font-semibold md:font-bold font-acme px-4 md:my-4">
          <div className="flex items-center bg-[#2D4C481A] p-2">
            <Image
              width={20}
              height={20}
              src={'/svg/tick.svg'}
              alt='tick'
            />
            <p className="">
              FROM ONE-DAY-LEAGUES TO WORLD-WIDE-TOURNAMENTS
            </p>
          </div>

          <div className="flex items-center bg-[#2D4C481A] p-2">
            <Image
              width={20}
              height={20}
              src={'/svg/tick.svg'}
              alt='tick'
            />
            <p className="">
              MAXIMUM TOOLS TO CREATE THE BEST FANTASY TEAM EVER
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-around items-center gap-1 md:gap-8 text-lg md:text-xl lg:text-2xl text-black md:text-center font-semibold md:font-bold font-acme px-4 md:py-4">
          <div className="w-full flex items-center bg-[#2D4C481A] p-2">
            <Image
              width={20}
              height={20}
              src={'/svg/tick.svg'}
              alt='tick'
            />
            <p className="md:w-2/3 lg:w-1/2 mx-auto">
              FREE AND PAID GAMES AVAILABLE
            </p>
          </div>

          <div className="w-full flex items-center bg-[#2D4C481A] p-2">
            <Image
              width={20}
              height={20}
              src={'/svg/tick.svg'}
              alt='tick'
            />
            <p className="md:w-2/3 lg:w-1/2 mx-auto">
              EASY TO MANAGE WALLET
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
