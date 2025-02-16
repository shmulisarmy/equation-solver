import pygame
from collections import deque

# --- Configuration ---
WIDTH, HEIGHT = 600, 600
GRID_SIZE = 20
grid_width = WIDTH // GRID_SIZE
grid_height = HEIGHT // GRID_SIZE

# Colors
WHITE = (255, 255, 255)
PLAYER_COLOR = (0, 255, 0)
TRAIL_COLOR = (0, 200, 0)
TERRITORY_COLOR = (0, 150, 0)
BORDER_COLOR = (0, 0, 0)

# --- Initialize grid ---
# 0: neutral, 1: player's territory
grid = [[0 for _ in range(grid_height)] for _ in range(grid_width)]

# --- Player Setup ---
# Player's position is tracked in grid coordinates.
player_pos = [grid_width // 2, grid_height // 2]
player_trail = []  # List of grid positions that form the current trail
player_direction = (1, 0)  # Moving right initially

# --- Pygame Setup ---
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

# --- Flood Fill Algorithm ---
def flood_fill_outside_with_barriers(grid, barriers):
    """
    Returns a 2D boolean array 'outside' where outside[x][y] is True
    if that cell is reachable from the border without crossing a barrier.
    """
    gw, gh = len(grid), len(grid[0])
    visited = [[False] * gh for _ in range(gw)]
    outside = [[False] * gh for _ in range(gw)]
    queue = deque()
    
    # Enqueue all border cells that are not barriers.
    for x in range(gw):
        for y in [0, gh - 1]:
            if (x, y) not in barriers and not visited[x][y]:
                queue.append((x, y))
                visited[x][y] = True
                outside[x][y] = True
    for y in range(gh):
        for x in [0, gw - 1]:
            if (x, y) not in barriers and not visited[x][y]:
                queue.append((x, y))
                visited[x][y] = True
                outside[x][y] = True
                
    # Standard BFS flood fill.
    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < gw and 0 <= ny < gh:
                if (nx, ny) in barriers:
                    continue
                if not visited[nx][ny]:
                    visited[nx][ny] = True
                    outside[nx][ny] = True
                    queue.append((nx, ny))
    return outside

def claim_territory(grid, barriers):
    """
    Claims all neutral cells (grid value 0) that are inside the barrier.
    """
    outside = flood_fill_outside_with_barriers(grid, barriers)
    gw, gh = len(grid), len(grid[0])
    for x in range(gw):
        for y in range(gh):
            if not outside[x][y] and grid[x][y] == 0:
                grid[x][y] = 1

# --- Main Game Loop ---
running = True
completed_loop = False  # Flag to indicate a loop was completed

while running:
    screen.fill(WHITE)
    
    # --- Event Handling ---
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP and player_direction != (0, 1):
                player_direction = (0, -1)
            elif event.key == pygame.K_DOWN and player_direction != (0, -1):
                player_direction = (0, 1)
            elif event.key == pygame.K_LEFT and player_direction != (1, 0):
                player_direction = (-1, 0)
            elif event.key == pygame.K_RIGHT and player_direction != (-1, 0):
                player_direction = (1, 0)
    
    # --- Move the Player ---
    new_pos = [player_pos[0] + player_direction[0], player_pos[1] + player_direction[1]]
    # Check boundaries (stop game if out of bounds)
    if 0 <= new_pos[0] < grid_width and 0 <= new_pos[1] < grid_height:
        player_pos = new_pos
    else:
        running = False
    
    # --- Trail Management ---
    # When moving outside existing territory, add the cell to the trail.
    if grid[player_pos[0]][player_pos[1]] == 0:
        if tuple(player_pos) not in player_trail:
            player_trail.append(tuple(player_pos))
    # If the player's head re-enters a cell in the current trail, a loop is completed.
    elif tuple(player_pos) in player_trail:
        completed_loop = True
    
    # --- Territory Claiming ---
    if completed_loop:
        barriers = set(player_trail)  # The trail forms the barrier of the loop.
        claim_territory(grid, barriers)
        # Clear the trail once territory is claimed.
        player_trail = []
        completed_loop = False
    
    # --- Drawing ---
    # Draw claimed territory.
    for x in range(grid_width):
        for y in range(grid_height):
            if grid[x][y] == 1:
                pygame.draw.rect(
                    screen, TERRITORY_COLOR,
                    (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
                )
    # Draw player's trail.
    for pos in player_trail:
        pygame.draw.rect(
            screen, TRAIL_COLOR,
            (pos[0] * GRID_SIZE, pos[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        )
    # Draw the player.
    pygame.draw.rect(
        screen, PLAYER_COLOR,
        (player_pos[0] * GRID_SIZE, player_pos[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE)
    )
    
    pygame.display.flip()
    clock.tick(10)

pygame.quit()
