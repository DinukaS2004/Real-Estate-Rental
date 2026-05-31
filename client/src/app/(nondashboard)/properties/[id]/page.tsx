export default async function PropertyDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <div>Property {id} — coming soon</div>;
}
