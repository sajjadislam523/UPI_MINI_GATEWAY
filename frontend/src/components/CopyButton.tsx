export default function CopyButton({
    text,
    label = "COPY",
}: {
    text: string;
    label?: string;
}) {
    const onClick = async () => {
        try {
            await navigator.clipboard.writeText(text);
            alert("Copied");
        } catch {
            alert("Copy failed");
        }
    };
    return (
        <button onClick={onClick} className="px-3 py-2 bg-gray-200 rounded">
            {label}
        </button>
    );
}
