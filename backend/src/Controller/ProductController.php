<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ProductController extends AbstractController
{
    #[Route("/api/products/new", name: 'api_products_create', methods:['POST'])]
    public function createProduct(Request $request, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $categoryId = $data['categorie'] ?? null;
        
        $category = $em->getRepository(Category::class)->find($categoryId);
        if (!$category) {
            return new JsonResponse(['error' => 'Category not found'], 404);
        }

        $product = new Product();
        $product->setNom($data['nom']);
        $product->setDescription($data['description'] ?? null);
        $product->setPrix($data['prix']);
        $product->setDateCreation(new \DateTime());
        $product->setCategorie($category);

        $em->persist($product);
        $em->flush();

        return new JsonResponse($serializer->serialize($product, 'json', ['groups' => ['read']]), 201, [], true);
    }

    #[Route("/api/products/edit/{id}", name: 'api_products_update', methods:['PUT'])]
    public function updateProduct(Request $request, int $id, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        $product = $em->getRepository(Product::class)->find($id);
        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $categoryId = $data['categorie'] ?? $product->getCategorie()->getId();
        
        $category = $em->getRepository(Category::class)->find($categoryId);
        if (!$category) {
            return new JsonResponse(['error' => 'Category not found'], 404);
        }

        $product->setNom($data['nom'] ?? $product->getNom());
        $product->setDescription($data['description'] ?? $product->getDescription());
        $product->setPrix($data['prix'] ?? $product->getPrix());
        $product->setCategorie($category);

        $em->flush();

        return new JsonResponse($serializer->serialize($product, 'json', ['groups' => ['read']]), 200, [], true);
    }
}