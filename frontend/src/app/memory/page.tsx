import PersonCard from "@/src/components/personCard";
import AddPersonCard from "@/src/components/addPersonCard";

export default function Memory() {
  return (
    <div className="flex flex-col gap-2 w-full border-t-4 border-gray-300 pt-8 px-8">
      {/* Add a top border and some padding */}
      <p className="mr-2 text-2xl font-bold tracking-tight text-gray-700">
        Your loved ones
      </p>
      <div className="flex flex-wrap gap-4 mt-4">
        <PersonCard name="Suveen" image_url="/suveen.jpeg" details="Hello" />
        <PersonCard name="Feifei" image_url="/feifei.jpeg" details="Hello" />
        <PersonCard name="Dexter" image_url="/dexter.jpeg" details="Hello" />
        {/* Include the AddPersonCard component */}
        <AddPersonCard />
      </div>
    </div>
  );
}
