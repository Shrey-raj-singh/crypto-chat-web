"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
        } else {
            fetchUsers();
        }
    }, [session, status, router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users"); // session cookie sent automatically
            console.log("Fetch users response:", res);
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            console.log("Fetched users:", data.users);
            setUsers(data.users || []);
        } catch (err) {
            console.error(err);
        }
    };

    // localStorage.removeItem("access_token"); // clear invalid token
    // router.push("/login");

    // useEffect(() => {
    //     console.log("Session detail...", session);
    //     async function fetchUsers() {
    //         try {
    //             const res = await fetch("/api/users");
    //             const data = await res.json();
    //             console.log("Fetched users:", data.users);
    //             setUsers(data.users || []);
    //         } catch (err) {
    //             console.error("Error fetching users:", err);
    //         }
    //     }
    //     fetchUsers();
    // }, []);
    const handleOpenChat = async (receiverId: string) => {
        try {
            const res = await fetch("/api/chat/open", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId }),
            });

            const data = await res.json();
            if (data.chatId) {
                router.push(`/chat/${data.chatId}`);
            } else {
                alert("Failed to open chat");
            }
        } catch (error) {
            console.error(error);
        }
    };



    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">💬 NovaNet Chat</h1>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    Logout
                </button>
            </div>
            {/* Logged-in user info */}
            <section className="mb-6 p-4 bg-gray-800 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Logged-in User</h2>
                <p><strong>ID:</strong> {session?.user.id}</p>
                <p><strong>Name:</strong> {session?.user.name || "Unnamed"}</p>
                <p><strong>Email:</strong> {session?.user.email}</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Available Users</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.length > 0 ? (
                        users.map((user) => (
                            // <div
                            //     key={user.id}
                            //     className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer"
                            //     onClick={async () => {
                            //         const res = await fetch("/api/chat/open", {
                            //             method: "POST",
                            //             headers: { "Content-Type": "application/json" },
                            //             body: JSON.stringify({ receiverId: user.id }),
                            //         });

                            //         const data = await res.json();
                            //         if (data.chatId) {
                            //             router.push(`/chat/${data.chatId}`);
                            //         } else {
                            //             console.error("Failed to open chat:", data);
                            //         }
                            //     }}
                            // >
                            //     <p className="font-semibold">{user.name || "Unnamed User"}</p>
                            //     <p className="text-gray-400 text-sm">{user.email}</p>
                            // </div>
                            <div
                                key={user.id}
                                className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition cursor-pointer"
                                onClick={() => handleOpenChat(user.id)}
                            >
                                {user.name}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No users found.</p>
                    )}
                </div>
            </section>
        </main>
    );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";

// type User = { id: string; name?: string; email?: string };

// export default function HomePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     if (status === "loading") return;
//     if (!session) router.push("/login");
//     else fetchUsers();
//   }, [session, status, router]);

// //   const fetchUsers = async () => {
// //     try {
// //       const res = await fetch("/api/users");
// //       if (!res.ok) throw new Error("Failed to fetch users");
// //       const data = await res.json();
// //       setUsers(data.users || []);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };


//   const fetchUsers = async (token: string) => {
//     try {
//       const res = await fetch("/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch users");
//       const data = await res.json();
//       setUsers(data.users || []);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       localStorage.removeItem("access_token"); // clear invalid token
//       router.push("/login");
//     }
//   };


