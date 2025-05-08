tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { XMarkIcon } from '@heroicons/react/24/solid'

interface AlertProps {
  title: string;
  description: string;
  color: "orange" | "red" | "purple";
  isOpen: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({
  title,
  description,
  color,
  isOpen,
  onClose,
}) => {
  const colorClasses = {
    orange: "bg-orange-100 border-orange-500 text-orange-800",
    red: "bg-red-100 border-red-500 text-red-800",
    purple: "bg-purple-100 border-purple-500 text-purple-800",
  };

  const borderColor = `border-2 ${
    colorClasses[color]?.split(" ")[1] || "border-gray-500"
  }`;
  const backgroundColor = colorClasses[color]?.split(" ")[0] || "bg-gray-100";
  const textColor = colorClasses[color]?.split(" ")[2] || "text-gray-800";

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className={`max-w-md ${backgroundColor} ${borderColor} ${textColor}`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-800">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <button className="bg-teal-500 text-white rounded-md px-4 py-2 hover:bg-teal-600 flex items-center space-x-2" onClick={() => onClose()}>
            <XMarkIcon className="h-5 w-5" />
          </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;