import { Icon, ArrowRightIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Link, LinkText } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
export const examples = [

    {
      name: "Card with Image",
      Code: function App(){ return (<Card className="p-5 rounded-lg max-w-[360px] m-3"><Image source={{ uri: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', }} className="mb-6 h-[240px] w-full rounded-md" /><Text className="text-sm font-normal mb-2 text-typography-700" >May 15, 2023</Text><Heading size="md" className="mb-4">The Power of Positive Thinking</Heading><Link href="https://gluestack.io/" isExternal><HStack className="items-center"><LinkText size="sm" className="font-semibold text-info-600 no-underline" >Read Blog</LinkText><Icon as={ArrowRightIcon} size="sm" className="text-info-600 mt-0.5 ml-0.5" /></HStack></Link></Card>); }
    },

    {
      name: "Advanced Composition",
      Code: function App(){ return (<Card className="p-6 rounded-lg max-w-[360px] m-3"><Box className="flex-row"><Avatar className="mr-4"><AvatarFallbackText>JD</AvatarFallbackText><AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1620403724159-40363e84a155?q=80&w=2646&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', }} /></Avatar><VStack><Heading size="md" className="mb-1">Jane Doe</Heading><Text size="sm">janedoe@sample.com</Text></VStack></Box><Box className="my-5 flex-col sm:flex-row" ><VStack className="items-center pb-2 sm:flex-1 sm:pb-0 sm:border-r sm:border-outline-300" ><Heading size="xs">81</Heading><Text size="xs">posts</Text></VStack><Divider orientation="horizontal" className="w-[40%] self-center bg-background-300 flex sm:hidden" /><VStack className="items-center py-2 sm:flex-1 sm:py-0 sm:border-r sm:border-outline-300" ><Heading size="xs">5,281</Heading><Text size="xs">followers</Text></VStack><Divider orientation="horizontal" className="w-[40%] self-center bg-background-300 flex sm:hidden" /><VStack className="items-center pt-2 sm:flex-1 sm:pt-0" ><Heading size="xs">281</Heading><Text size="xs">following</Text></VStack></Box><Box className="mb-5 flex-col sm:mb-6 sm:flex-row" ><Image source={{ uri: 'https://images.unsplash.com/photo-1592089416462-2b0cb7da8379?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', }} className="mb-3 rounded-md w-full h-[140px] sm:mb-0 sm:mr-3 sm:w-[150px] sm:h-[154px]" /><Image source={{ uri: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?q=80&w=2425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', }} className="rounded-md w-full h-[140px] sm:w-[150px] sm:h-[154px]" /></Box><Button className="py-2 px-4"><ButtonText size="sm">Follow</ButtonText></Button></Card>); }
    },

    {
      name: "Product Card",
      Code: function App(){ return (<Card className="p-5 rounded-lg max-w-[360px] m-3"><Image source={{ uri: 'https://images.unsplash.com/photo-1595231712325-9fedecef7575?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D', }} className="mb-6 h-[240px] w-full rounded-md" /><Text className="text-sm font-normal mb-2 text-typography-700" >Fashion Clothing</Text><VStack className="mb-6"><Heading size="md" className="mb-4">Cotton Kurta</Heading><Text size="sm">Floral embroidered notch neck thread work cotton kurta in white and black.</Text></VStack><Box className="flex-col sm:flex-row" ><Button className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1" ><ButtonText size="sm">Add to cart</ButtonText></Button><Button variant="outline" className="px-4 py-2 border-outline-300 sm:flex-1" ><ButtonText size="sm" className="text-typography-600" >Wishlist</ButtonText></Button></Box></Card>); }
    },

    {
      name: "Blog Card",
      Code: function App(){ return (<Card className="p-5 rounded-lg max-w-[360px] m-3" ><Text className="text-sm font-normal mb-2 text-typography-700" >May 15, 2023</Text><VStack className="mb-6"><Heading size="md" className="mb-4">The Power of Positive Thinking</Heading><Text size="sm">Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges. Explore practical tips and techniques to cultivate a positive mindset for greater happiness and success.</Text></VStack><Box className="flex-row"><Avatar className="mr-3"><AvatarFallbackText>RR</AvatarFallbackText><AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60', }} /></Avatar><VStack><Heading size="sm" className="mb-1">John Smith</Heading><Text size="sm">Motivational Speaker</Text></VStack></Box></Card>); }
    }
];