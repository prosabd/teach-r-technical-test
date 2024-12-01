<?php

namespace App\Entity;

use App\Repository\CategoryRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\OneToOne(mappedBy: 'categorie', cascade: ['persist', 'remove'])]
    private ?Product $produits = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getProduits(): ?Product
    {
        return $this->produits;
    }

    public function setProduits(Product $produits): static
    {
        // set the owning side of the relation if necessary
        if ($produits->getCategorie() !== $this) {
            $produits->setCategorie($this);
        }

        $this->produits = $produits;

        return $this;
    }
}
