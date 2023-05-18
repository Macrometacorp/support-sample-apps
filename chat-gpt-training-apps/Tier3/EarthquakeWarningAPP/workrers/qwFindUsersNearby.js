// Define a function for generating a Query Worker

export function findUsers() {
    return `
    FOR loc IN WITHIN (@users, @lat,@long, 200 *1000)
    RETURN loc
`;
}
