import PersonCard from "../components/personCard";
import LocationCard from "../components/locationCard";
import ConversationCard from "../components/conversationCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-12 gap-4">
      <p className="mr-2 text-md font-semibold tracking-tight">Hello Suveen 👋! </p>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2 w-2/5">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">Recent Location</p>
          <div>
            <LocationCard
              name="Studio45, San Francisco"
              image_url="/sf.webp"
              details="SF"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-3/5">
        <p className="mr-2 text-xl font-semibold tracking-tight my-2">People around you</p>
          <div>
            <PersonCard
              name="Suveen"
              image_url="/suveen.jpeg"
              details="Hello"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-8 mt-8">
        <div className="flex flex-col gap-2 w-1/2">
          <p className="mr-2 text-xl font-semibold tracking-tight my-2">Recent Conversations</p>
          <div>
            <ConversationCard text="gpt-4o and its loopholes" time="4 mins ago"/>
          </div>
        </div>
        {/* <div className="flex flex-col gap-2 w-1/2">
        <p className="mr-2 text-xl font-semibold tracking-tight my-2">Suggestions</p>
          <div>
            <PersonCard
              name="Suveen"
              image_url="/suveen.jpeg"
              details="Hello"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}
