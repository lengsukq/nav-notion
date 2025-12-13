'use client'

import { Grid, Card, CardBody, Link, Chip } from '@heroui/react'
import { ExternalLink } from 'lucide-react'

interface NavigationData {
  id: number
  title: string
  url: string
  description: string
  tags: string[]
  icon: string
}

interface NavigationCardsProps {
  data: NavigationData[]
}

export function NavigationCards({ data }: NavigationCardsProps) {
  return (
    <Grid.Container gap={6}>
      {data.map(item => (
        <Grid key={item.id} xs={12} sm={6} md={4} lg={3}>
          <Card 
            isHoverable
            isPressable
            classNames={{
              base: "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20",
              body: "p-6"
            }}
            onPress={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
          >
            <CardBody>
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{item.icon}</div>
                <Link
                  isExternal
                  href={item.url}
                  className="text-gray-400 hover:text-white transition-colors"
                  onPress={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <Chip
                    key={tag}
                    size="sm"
                    variant="bordered"
                    classNames={{
                      base: "bg-purple-600/20 border-purple-500/30",
                      content: "text-purple-300 text-xs"
                    }}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </CardBody>
          </Card>
        </Grid>
      ))}
    </Grid.Container>
  )
}