const baseUrl = process.env.NEXT_PUBLIC_BACK_URL

export const createOrder = async (order: number[], token: string  ) => {
    try {
        const response = await fetch(`${baseUrl}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ products: order }),
        });
        const orderData = await response.json();
        return orderData;
    }

    catch (error) {
        throw error;
    }

}

export const getAllOrders = async (token: string) => {
    try {
         const response = await fetch(`${baseUrl}/users/orders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const ordersData = await response.json();
        return ordersData;
    }
    catch (error) {
        throw error;
    }
}